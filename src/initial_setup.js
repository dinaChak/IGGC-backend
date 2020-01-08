const { AdmissionNew } = require('./models/admission_new');
const { IQAC } = require('./models/iqac');
const { SMS } = require('./models/sms_counter');

const initCheck = async () => {
  const response = await Promise.all([
    AdmissionNew.find({}),
    IQAC.find({}),
    SMS.find({}),
  ]);
  const admissions = response[0];
  const iqacs = response[1];
  const sms = response[2];

  const objs = [];

  if (admissions.length === 0) {
    objs.push(new AdmissionNew({}));
  }

  if (iqacs.length === 0) {
    objs.push(new IQAC({}));
  }

  if (sms.length === 0) {
    objs.push(new SMS({}));
  }


  await Promise.all(objs.map(obj => obj.save()));
};

initCheck();
