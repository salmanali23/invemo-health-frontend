import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'en-US': {
    translation: {
      Profile: 'Profile',
      Add: 'Add ',
      Patients: 'Patients',
      Member: 'Member',
      Doctor: 'Doctor',
      Status: 'Status',
      'Edit ': 'Edit',
      Opportunity: 'Opportunity',
      Leads: 'Lead',
      Qualified: 'Qualified',
      Booked: 'Booked',
      Treated: 'Treated',
      Search: 'Search',
      Save: 'Save',
      Select: 'Select',
      'Procedure Name': 'Procedure Name',
      'Click to upload image': 'Click to upload image',
      'First Name': 'First name',
      'is required': 'is required',
      'Last Name': 'Last name',
      Role: 'Role',
      Gender: 'Gender',
      'Date of Birth': 'Date of Birth',
      Male: 'Male',
      Female: 'Female',
      Other: 'Other',
      Patient: 'Patient',
    },
  },
  es: {
    translation: {
      Profile: 'Perfil',
      Add: 'Agregar',
      Patients: 'Pacientes',
      Member: 'Miembro',
      Doctor: 'Médico',
      Status: 'Estado',
      'Edit ': 'Editar',
      Opportunity: 'Oportunidad',
      Leads: 'Dirigir',
      Qualified: 'Cualificados',
      Booked: 'Reservado',
      Treated: 'Tratado',
      Search: 'Buscar',
      Save: 'Guardar',
      Select: 'Seleccionar',
      'Procedure Name': 'Nombre del Procedimiento',
      'Click to upload image': 'Haga clic para subir imagen',
      'First Name': 'Nombre',
      'is required': 'es requerido',
      'Last Name': 'Apellido',
      Role: 'Rol',
      Gender: 'Género',
      'Date of Birth': 'Fecha de Nacimiento',
      Male: 'Hombre',
      Female: 'Mujer',
      Other: 'Otro',
      Patient: 'Paciente',
    },
  },
};
i18n
  .use(initReactI18next)

  .init({
    resources,
    lng: navigator.language,
    interpolation: {
      escapeValue: false,
    },

    debug: false,
  });

export default i18n;