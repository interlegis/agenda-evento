export const FIELD_USUARIO_UPDATE = {
  first_name: '',
  last_name: '',
  username: '',
  email:'',
  password:''
};

export const FIELD_ESQUECI_SENHA = {
  email: {
    type:'email',
    titulo:'Email:',
    label:'seu email'
  },
};

export const FIELD_RECUPERAR_SENHA = {
  password: {
    type:'password',
    titulo:'Nova Senha:',
    label:'sua senha'
  }
};

export const FIELD_USUARIO_CADASTRO = {
  first_name: {
    type:'text',
    titulo:'Primeiro Nome:',
    label:'seu primeiro nome'
  },
  last_name: {
    type:'text',
    titulo:'Sobrenome:',
    label:'seu sobrenome'
  },
  email: {
    type:'email',
    titulo:'Email:',
    label:'o email'
  },
  username: {
    type:'text',
    titulo:'Nome de Usuario:',
    label:'o nome do usuario'
  },
  password: {
    type:'password',
    titulo:'Senha:',
    label:'sua senha'
  }
};

export const FIELD_USUARIO_LOGIN = {
  username: {
    type:'text',
    titulo:'Usuario:',
    label:'o nome do usuario'
  },
  password: {
    type:'password',
    titulo:'Senha:',
    label:'sua senha'
  }
};

export const FIELD_PEDIDO = {
  nome: {
    type: 'text',
    titulo: 'Nome do Evento:',
    label: 'o nome do evento'
  },
  descricao: {
    type: 'textarea',
    titulo: 'Descrição do Evento:',
    label: 'a descrição do evento'
  },
  local: {
    type: 'select',
    titulo: 'Local do Evento:',
    option: {
      SR: 'SR',
      AI: 'AI'
    },
    label: 'Selecione'
  },
  data_inicio: {
    type: 'data_inicio',
    titulo: 'Data de Início:',
    label: 'a data de início'
  },
  data_fim: {
    type: 'data_fim',
    titulo: 'Data de Fim:',
    label: 'a data de fim'
  },
  hora_inicio: {
    type: 'time',
    titulo: 'Hora de Início:',
    label: 'a hora de início'
  },
  hora_fim: {
    type: 'time',
    titulo: 'Hora de Termino:',
    label: 'a hora de termino'
  },
  legislativo: {
    type: 'checkbox',
    name: 'legislativo',
    titulo: 'Evento Legislativo:',
    label: 'legislativo'
  },
  observacao: {
    type: 'textarea',
    type_s: 'observacao',
    titulo: 'Obervação:',
    label: 'a observação'
  },
  video_conferencia: {
    type: 'checkbox',
    name: 'video_conferencia',
    titulo: 'Será necessária utilização da Video Conferência:',
    label: ''
  },
  nome_responsavel: {
    type: 'text',
    titulo: 'Nome do Resposável pelo Evento:',
    label: 'o nome do responsável'
  },
  email_responsavel: {
    type: 'Email',
    titulo: 'Email do Responsável:',
    label: 'o email do responsável'
  },
  telefone_responsavel: {
    type: 'tel',
    titulo: 'Telefone do Responsável:',
    label: 'o telefone do responsável'
  },
  lotacao_responsavel: {
    type: 'text',
    titulo: 'Lotação do Responsável:',
    label: 'a lotação do responsável'
  }
};
