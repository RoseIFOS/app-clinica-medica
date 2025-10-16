from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User, UserRole
from app.models.horario_disponivel import HorarioDisponivel
from app.schemas.medico import MedicoCreate, MedicoUpdate, Medico, MedicoList, HorarioMedico, MedicoComHorarios
from app.core.security import get_password_hash

router = APIRouter()

@router.get("/", response_model=MedicoList)
def list_medicos(
    skip: int = Query(0, ge=0, description="Número de registros para pular"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros para retornar"),
    especialidade: Optional[str] = Query(None, description="Filtrar por especialidade"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar médicos com filtros e paginação"""
    query = db.query(User).filter(User.role == UserRole.MEDICO)
    
    if especialidade:
        query = query.filter(User.especialidade.ilike(f"%{especialidade}%"))
    
    total = query.count()
    medicos = query.offset(skip).limit(limit).all()
    
    return MedicoList(
        items=medicos,
        total=total,
        skip=skip,
        limit=limit
    )

@router.post("/", response_model=Medico, status_code=status.HTTP_201_CREATED)
def create_medico(
    medico: MedicoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cadastrar novo médico"""
    # Verificar se email já existe
    existing_user = db.query(User).filter(User.email == medico.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )
    
    # Verificar se CRM já existe
    existing_crm = db.query(User).filter(User.crm == medico.crm).first()
    if existing_crm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CRM já cadastrado"
        )
    
    # Criar médico
    hashed_password = get_password_hash(medico.password)
    db_medico = User(
        email=medico.email,
        hashed_password=hashed_password,
        nome=medico.nome,
        role=UserRole.MEDICO,
        crm=medico.crm,
        especialidade=medico.especialidade
    )
    
    db.add(db_medico)
    db.commit()
    db.refresh(db_medico)
    
    return db_medico

@router.get("/{medico_id}", response_model=Medico)
def get_medico(
    medico_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de um médico"""
    medico = db.query(User).filter(
        User.id == medico_id,
        User.role == UserRole.MEDICO
    ).first()
    
    if not medico:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Médico não encontrado"
        )
    
    return medico

@router.put("/{medico_id}", response_model=Medico)
def update_medico(
    medico_id: int,
    medico_update: MedicoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar dados de um médico"""
    medico = db.query(User).filter(
        User.id == medico_id,
        User.role == UserRole.MEDICO
    ).first()
    
    if not medico:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Médico não encontrado"
        )
    
    # Verificar conflitos
    if medico_update.email and medico_update.email != medico.email:
        existing_email = db.query(User).filter(
            User.email == medico_update.email,
            User.id != medico_id
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )
    
    if medico_update.crm and medico_update.crm != medico.crm:
        existing_crm = db.query(User).filter(
            User.crm == medico_update.crm,
            User.id != medico_id
        ).first()
        if existing_crm:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CRM já cadastrado"
            )
    
    # Atualizar campos
    update_data = medico_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "password" and value:
            setattr(medico, "hashed_password", get_password_hash(value))
        elif field != "password":
            setattr(medico, field, value)
    
    db.commit()
    db.refresh(medico)
    
    return medico

@router.get("/{medico_id}/horarios", response_model=List[HorarioMedico])
def get_medico_horarios(
    medico_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter horários de atendimento de um médico"""
    # Verificar se médico existe
    medico = db.query(User).filter(
        User.id == medico_id,
        User.role == UserRole.MEDICO
    ).first()
    
    if not medico:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Médico não encontrado"
        )
    
    horarios = db.query(HorarioDisponivel).filter(
        HorarioDisponivel.medico_id == medico_id
    ).all()
    
    return horarios

@router.get("/{medico_id}/completo", response_model=MedicoComHorarios)
def get_medico_completo(
    medico_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter médico com seus horários de atendimento"""
    # Verificar se médico existe
    medico = db.query(User).filter(
        User.id == medico_id,
        User.role == UserRole.MEDICO
    ).first()
    
    if not medico:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Médico não encontrado"
        )
    
    # Buscar horários
    horarios = db.query(HorarioDisponivel).filter(
        HorarioDisponivel.medico_id == medico_id
    ).all()
    
    # Converter horários
    horarios_schema = []
    for horario in horarios:
        horarios_schema.append(HorarioMedico(
            id=horario.id,
            dia_semana=horario.dia_semana,
            hora_inicio=horario.hora_inicio,
            hora_fim=horario.hora_fim,
            ativo=horario.ativo
        ))
    
    return MedicoComHorarios(
        id=medico.id,
        nome=medico.nome,
        email=medico.email,
        crm=medico.crm,
        especialidade=medico.especialidade,
        is_active=medico.is_active,
        created_at=medico.created_at,
        horarios=horarios_schema
    )
