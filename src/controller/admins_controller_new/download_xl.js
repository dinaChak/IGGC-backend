const _ = require('lodash');
const Excel = require('exceljs');

const { StudentInstance } = require('../../models/studentInstance');

const downloadXls = async (req, res) => {
  try {
    const {
      sort = '',
      newRegistration,
      verificationStatus = '',
      semesterAdmission,
      status,
    } = req.query;

    const queryBody = _.pick(req.query, ['current_semester'], ['branch']);
    const query = {
      newRegistration: newRegistration === 'true',
      ...queryBody,
    };

    if (semesterAdmission === 'true') {
      query.newRegistration = false;
      query['admission.status'] = { $nin: ['eligible', 'ineligible', 'admission_initiated', 'completed'] };
    }

    if (verificationStatus.trim() !== '') {
      query['admission.status'] = verificationStatus;
    }

    const studentInstances = await StudentInstance.find(query)
      .populate('semester')
      .populate('student')
      .sort(sort);

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('MySheet');
    let columns = [
      { header: 'Name', key: 'name', width: 32 },
      { header: 'Programme', key: 'branch', width: 16 },
      { header: 'Semester', key: 'semesterNo', width: 12 },
    ];

    if (status) {
      columns = [
        ...columns,
        { header: 'Status', key: 'status', width: 16 },
      ];
    }

    worksheet.columns = columns;

    studentInstances.forEach((studentInstance) => {
      let row = {
        name: studentInstance.name,
        branch: studentInstance.branch,
        semesterNo: studentInstance.current_semester,
      };
      if (status) {
        row = {
          ...row,
          status: studentInstance.admission.status,
        };
      }
      worksheet.addRow(row);
    });

    const fileName = 'students.xlsx';

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).send();
  }
};


module.exports = {
  downloadXls,
};
