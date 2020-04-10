const _ = require('lodash');
const Excel = require('exceljs');
const moment = require('moment');

const { Student } = require('../../models/student_new');
// const { Faculty } = require('../../models/faculty');

// const downloadStudentsSheet = async (req, res) => {
//   try {
//     const {
//       sort = 'semester',
//       fileName = 'students',
//     } = req.query;
//     const { programme } = req.params;
//     const query = _.pick(req.query, ['admissionStatus']);
//     query.branch = programme;
//     const students = await Student.find(query).sort(sort);


//     const workbook = new Excel.Workbook();
//     const worksheet = workbook.addWorksheet('MySheet');

//     const columns = [
//       { header: 'Name', key: 'name', width: 20 },
//       { header: 'Programme', key: 'branch', width: 16 },
//       { header: 'Semester', key: 'semester', width: 12 },
//       { header: 'D.O.B', key: 'date_of_birth', width: 14 },
//       { header: 'Mobile no.', key: 'phone_number', width: 16 },
//       {
//         header: 'Subject Combination',
//         key: 'subject_combination',
//         width: 50,
//       },
//       { header: 'Status', key: 'admissionStatus', width: 16 },
//       { header: 'Photo', width: 16 },
//     ];

//     worksheet.columns = columns;

//     students.forEach((
//       {
//         name,
//         semester,
//         branch,
//         // eslint-disable-next-line camelcase
//         date_of_birth,
//         // eslint-disable-next-line camelcase
//         phone_number,
//         admissionStatus,
//         subjectCombination,
//         // eslint-disable-next-line camelcase
//         profile_image,
//       },
//       i,
//     ) => {
//       worksheet.addRow({
//         name: String(name).toUpperCase(),
//         semester,
//         branch: String(branch).toUpperCase(),
//         date_of_birth: moment(date_of_birth).format('DD/MM/YYYY'),
//         phone_number,
//         admissionStatus,
//         subject_combination: subjectCombination
//           .map(subject => `${subject.code} - ${subject.title}`)
//           .join(', '),
//       });
//       worksheet.getCell(`A${i + 2}`).alignment = {
//         vertical: 'bottom',
//         wrapText: true,
//       };
//       worksheet.getCell(`F${i + 2}`).alignment = {
//         horizontal: 'justify',
//         vertical: 'bottom',
//         wrapText: true,
//       };
//       worksheet.getRow(i + 2).height = 80;
//       worksheet.addImage(workbook.addImage({
//         filename: profile_image.path,
//         extension: 'jpeg',
//       }),
//       {
//         tl: { col: 7, row: i + 1 },
//         br: { col: 8, row: i + 2 },
//       });
//     });

// res.setHeader(
//   'Content-Type',
//   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
// );
//     res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     res.status(500).send();
//   }
// };

const downloadApplicantSheet = async (req, res) => {
  try {
    const {
      sort,
      fileName = 'students',
    } = req.query;
    const { programme } = req.params;
    const query = _.pick(req.query, ['admissionStatus', 'semester']);
    query.branch = programme;
    let students;


    if (sort) {
      if (sort === 'class_roll_no') {
        students = await Student
          .find(query)
          .sort(sort)
          .collation({ locale: 'en_US', numericOrdering: true });
      } else {
        students = await Student.find(query).sort(sort);
      }
    } else {
      students = await Student.find(query);
    }


    const withGeo = !!(query.semester && Number(query.semester) === 1 && programme === 'b.a');


    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('MySheet');

    const columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Programme', key: 'branch', width: 16 },
      { header: 'Semester', key: 'semester', width: 12 },
      { header: 'D.O.B', key: 'date_of_birth', width: 14 },
      { header: 'Mobile no.', key: 'phone_number', width: 16 },
      {
        header: 'Subject Combination',
        key: 'subject_combination',
        width: 50,
      },
      { header: 'Status', key: 'admissionStatus', width: 16 },
    ];

    if (withGeo) {
      columns.push({ header: 'Geo', key: 'geo', width: 12 });
      columns.push({ header: 'Geo Mark', key: 'geo_mark', width: 12 });
    }


    columns.push({ header: 'Photo', width: 16 });

    worksheet.columns = columns;

    students.forEach((
      {
        name,
        semester,
        branch,
        // eslint-disable-next-line camelcase
        date_of_birth,
        // eslint-disable-next-line camelcase
        phone_number,
        admissionStatus,
        subjectCombination,
        // eslint-disable-next-line camelcase
        profile_image,
        // eslint-disable-next-line camelcase
        last_examination,
      },
      i,
    ) => {
      const geo = subjectCombination.some(subject => subject.code === 'BGEO-101 (T)');
      // eslint-disable-next-line camelcase
      const { subjects } = last_examination;
      const haveGeo = subjects.some(sub => String(sub.title).toLowerCase().includes('geography'));
      const row = {
        name: String(name).toUpperCase(),
        semester,
        branch: String(branch).toUpperCase(),
        date_of_birth: moment(date_of_birth).format('DD/MM/YYYY'),
        phone_number,
        admissionStatus,
        subject_combination: subjectCombination
          .map(subject => `${subject.code} - ${subject.title}`)
          .join(', '),
      };
      if (withGeo) {
        row.geo = geo ? 'YES' : 'NO';
        if (haveGeo) {
          row.geo_mark = subjects.find(sub => String(sub.title).toLowerCase().includes('geography')).mark;
        } else {
          row.geo_mark = '';
        }
      }
      worksheet.addRow(row);
      worksheet.getCell(`A${i + 2}`).alignment = {
        vertical: 'bottom',
        wrapText: true,
      };
      worksheet.getCell(`F${i + 2}`).alignment = {
        horizontal: 'justify',
        vertical: 'bottom',
        wrapText: true,
      };
      worksheet.getRow(i + 2).height = 80;
      worksheet.addImage(workbook.addImage({
        filename: profile_image.path,
        extension: 'jpeg',
      }),
      {
        tl: { col: withGeo ? 7 + 2 : 7, row: i + 1 },
        br: { col: withGeo ? 8 + 2 : 8, row: i + 2 },
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).send();
  }
};

/**
 * OLD
 * */
// const downloadStudentsSheet = async (req, res) => {
//   try {
//     const {
//       sort,
//       photo = 'no',
//       fileName = 'students',
//     } = req.query;
//     const { programme } = req.params;
//     const query = _.pick(req.query, ['semester']);
//     query.branch = programme;
//     query.admissionStatus = 'completed';
//     let students;
//     if (sort) {
//       students = await Student.find(query).sort(sort);
//     } else {
//       students = await Student.find(query);
//     }

//     const sortedSubjectCombination = [];


//     for (let i = 0; i < students.length; i += 1) {
//       const subComb = students[i].subjectCombination.map(sub => sub.code).sort();
//       let inserted = false;
//       for (let j = 0; j < i; j += 1) {
//         if (sortedSubjectCombination[j].every(sub => subComb.includes(sub))) {
//           sortedSubjectCombination.push(sortedSubjectCombination[j]);
//           inserted = true;
//           break;
//         }
//       }
//       if (!inserted) {
//         // sortedSubjectCombination.push(subComb);
//         // eslint-disable-next-line no-shadow
//         for (let i = 0; i < sortedSubjectCombination.length; i += 1) {
//           for (let j = 0; j < sortedSubjectCombination[i].length; j += 1) {
//             const sub = sortedSubjectCombination[i][j];
//             if (subComb.includes(sub)) {
//               const subIndex = subComb.indexOf(sub);
//               if (subIndex !== j) {
//                 const temp = subComb[j];
//                 subComb[j] = sub;
//                 subComb[subIndex] = temp;
//               }
//             }
//           }
//         }
//         sortedSubjectCombination.push(subComb);
//       }
//     }


//     const workbook = new Excel.Workbook();
//     const worksheet = workbook.addWorksheet('MySheet');

//     if (query.semester && Number(query.semester) !== 1) {
//       const columns = [
//         { header: 'Name', key: 'name', width: 20 },
//         { header: 'Gender', key: 'gender', width: 16 },
//         { header: 'Programme', key: 'branch', width: 16 },
//         { header: 'Semester', key: 'semester', width: 12 },
//         {
//           header: 'Subject Combination',
//           key: 'subject_combination',
//           width: 12,
//         },
//       ];

//       worksheet.columns = columns;
//       const combsLength = 0;

//       students.forEach((
//         {
//           name,
//           gender,
//           branch,
//           semester,
//           // subjectCombination,
//         },
//         i,
//       ) => {
//         // const combs = subjectCombination.map(sub => sub.code).sort();
//         // if (combs.length > combsLength) {
//         //   combsLength = combs.length;
//         // }
//         worksheet.addRow([
//           String(name).toUpperCase(),
//           gender,
//           String(branch).toUpperCase(),
//           semester,
//           ...sortedSubjectCombination[i],
//         ]);
//       });

//       const fromCell = 65 + 4;
//       const toCell = fromCell + combsLength - 1;

//       worksheet.mergeCells(`${String.fromCharCode(fromCell)}1:${String.fromCharCode(toCell)}1`);
//     } else {
//       const columns = [
//         { header: 'Name', key: 'name', width: 20 },
//         { header: "Father's Name", key: 'fatherName', width: 20 },
//         { header: "Mother's Name", key: 'motherName', width: 20 },
//         { header: 'Date Of Birth', key: 'date_of_birth', width: 16 },
//         { header: 'Gender', key: 'gender', width: 16 },
//         { header: 'Category', key: 'category', width: 16 },
//         { header: 'Permanent Address', key: 'permanentAddress', width: 36 },
//         { header: 'Last Exam Passed', key: 'lastExamPassed', width: 16 },
//         { header: 'Board', key: 'board', width: 16 },
//         { header: 'Roll No.', key: 'rollNo', width: 16 },
//         { header: 'Name Of Institution', key: 'nameOfInstitution', width: 20 },
//         { header: 'Subject Offered', key: 'subjectOffered', width: 36 },
//         { header: 'Total Mark', key: 'totalMark', width: 16 },
//         { header: 'Percentage', key: 'Percentage', width: 16 },
//         { header: 'Programme', key: 'branch', width: 16 },
//         { header: 'Semester', key: 'semester', width: 12 },
//         {
//           header: 'Subject Combination',
//           key: 'subject_combination',
//           width: 12,
//         },
//       ];
//       // if (photo === 'yes') {
//       //   columns = [
//       //     { header: 'Photo', width: 16 },
//       //     ...columns,
//       //   ];
//       // }

//       worksheet.columns = columns;
//       let combsLength = 0;

//       students.forEach(({
//         name,
//         fatherName,
//         motherName,
//         // eslint-disable-next-line camelcase
//         date_of_birth,
//         gender,
//         category,
//         permanentAddress,
//         // eslint-disable-next-line camelcase
//         last_examination,
//         branch,
//         semester,
//         subjectCombination,
//         // eslint-disable-next-line camelcase
//         profile_image,
//       }, i) => {
//         const combs = subjectCombination.map(sub => sub.code).sort();
//         if (combs.length > combsLength) {
//           combsLength = combs.length;
//         }
//         const row = [
//           String(name).toUpperCase(),
//           String(fatherName).toUpperCase(),
//           String(motherName).toUpperCase(),
//           // eslint-disable-next-line camelcase
//           date_of_birth,
//           gender,
//           category.type,
//           `Village/Town: ${permanentAddress.vill_town},
// PS / PO: ${ permanentAddress.ps_po },
// District: ${ permanentAddress.district },
// State: ${ permanentAddress.state },
// PIN: ${ permanentAddress.pin }`,
//           last_examination.examination,
//           last_examination.board_uni,
//           last_examination.roll_no,
//           last_examination.institution,
//           last_examination.subjects.map(sub => sub.title).join(', '),
//           last_examination.total_mark,
//           last_examination.percentage,
//           String(branch).toUpperCase(),
//           semester,
//           // ...combs,
//           ...sortedSubjectCombination[i],
//         ];
//         worksheet.addRow(row);
//         if (photo === 'yes') {
//           // row = [' ', ...row];
//           worksheet.getRow(i + 2).height = 80;
//           worksheet.addImage(workbook.addImage({
//             filename: profile_image.path,
//             extension: 'jpeg',
//           }),
//           {
//             tl: { col: columns.length + combsLength - 1, row: i + 1 },
//             br: { col: columns.length + combsLength, row: i + 2 },
//           });
//         }
//       });

//       const fromCell = 65 + columns.length - 1;
//       const toCell = fromCell + combsLength - 1;
//       worksheet.mergeCells(`${String.fromCharCode(fromCell)}1:${String.fromCharCode(toCell)}1`);
//     }

// res.setHeader(
//   'Content-Type',
//   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// );
//     res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     res.status(500).send();
//   }
// };


/**
 *
 * NEW
 */
const downloadStudentsSheet = async (req, res) => {
  try {
    const {
      sort,
      photo = 'no',
      fileName = 'students',
      subjectsComb = '',
    } = req.query;
    const { programme } = req.params;
    const query = _.pick(req.query, ['semester']);
    query.branch = programme;
    query.admissionStatus = 'completed';
    if (subjectsComb.trim() === '') {
      return res.status(422).send({
        error: 'Please provide subject combination.',
      });
    }

    const subCombs = subjectsComb.split(',');

    let students;
    if (sort) {
      if (sort === 'class_roll_no') {
        students = await Student
          .find(query)
          .sort(sort)
          .collation({ locale: 'en_US', numericOrdering: true });
      } else {
        students = await Student.find(query).sort(sort);
      }
    } else {
      students = await Student.find(query);
    }

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('MySheet');

    // cat, mob, email

    if (query.semester && Number(query.semester) !== 1) {
      const columns = [
        { header: 'Class Roll No.', key: 'class_roll_no', width: 20 },
        { header: 'Name', key: 'name', width: 20 },
        // { header: 'Class Roll No.', key: 'class_roll_no', width: 20 },
        { header: 'University Roll No.', key: 'uni_roll_no', width: 20 },
        { header: 'Registration No.', key: 'uni_reg_no', width: 20 },
        { header: 'Gender', key: 'gender', width: 16 },
        { header: 'Category', key: 'category', width: 16 },
        { header: 'Mobile no.', key: 'phone_number', width: 16 },
        { header: 'E-mail', key: 'email', width: 16 },
        { header: 'Programme', key: 'branch', width: 16 },
        { header: 'Semester', key: 'semester', width: 12 },
        {
          header: 'Subject Combination',
          key: 'subject_combination',
          width: 12,
        },
      ];

      worksheet.columns = columns;
      let combsLength = 0;

      students.forEach((
        {
          // eslint-disable-next-line camelcase
          class_roll_no,
          name,
          // eslint-disable-next-line camelcase
          uni_roll_no,
          // eslint-disable-next-line camelcase
          uni_reg_no,
          category,
          // eslint-disable-next-line camelcase
          phone_number,
          email,
          gender,
          branch,
          semester,
          subjectCombination,
        },
        // i,
      ) => {
        // const combs = subjectCombination.map(sub => sub.code).sort();
        // if (combs.length > combsLength) {
        //   combsLength = combs.length;
        // }
        const combs = subjectCombination.map(sub => sub.code).sort();
        const filterSubCombs = subCombs.map(sub => (combs.includes(sub) ? sub : ''));
        combsLength = filterSubCombs.length;
        worksheet.addRow([
          // eslint-disable-next-line camelcase
          class_roll_no,
          String(name).toUpperCase(),
          // eslint-disable-next-line camelcase
          uni_roll_no,
          // eslint-disable-next-line camelcase
          uni_reg_no,
          gender,
          category.type,
          // eslint-disable-next-line camelcase
          phone_number,
          email,
          String(branch).toUpperCase(),
          semester,
          // ...sortedSubjectCombination[i],
          // ...combs,
          ...filterSubCombs,
        ]);
      });

      const fromCell = 65 + columns.length - 1;
      const toCell = fromCell + combsLength - 1;

      worksheet.mergeCells(`${String.fromCharCode(fromCell)}1:${String.fromCharCode(toCell)}1`);
    } else {
      const columns = [
        // { header: 'University Roll No.', key: 'uni_roll_no', width: 20 },
        { header: 'Class Roll No.', key: 'class_roll_no', width: 20 },
        { header: 'Name', key: 'name', width: 20 },
        // { header: 'University Roll No.', key: 'uni_roll_no', width: 20 },
        // { header: 'Class Roll No.', key: 'class_roll_no', width: 20 },
        { header: 'University Roll No.', key: 'uni_roll_no', width: 20 },
        { header: 'Mobile no.', key: 'phone_number', width: 16 },
        { header: "Father's Name", key: 'fatherName', width: 20 },
        { header: "Mother's Name", key: 'motherName', width: 20 },
        { header: 'Date Of Birth', key: 'date_of_birth', width: 16 },
        { header: 'Gender', key: 'gender', width: 16 },
        { header: 'Category', key: 'category', width: 16 },
        { header: 'Permanent Address', key: 'permanentAddress', width: 36 },
        { header: 'Last Exam Passed', key: 'lastExamPassed', width: 16 },
        { header: 'Board', key: 'board', width: 16 },
        { header: 'Roll No.', key: 'rollNo', width: 16 },
        { header: 'Name Of Institution', key: 'nameOfInstitution', width: 20 },
        { header: 'Subject Offered', key: 'subjectOffered', width: 36 },
        { header: 'Total Mark', key: 'totalMark', width: 16 },
        { header: 'Percentage', key: 'Percentage', width: 16 },
        { header: 'Programme', key: 'branch', width: 16 },
        { header: 'Semester', key: 'semester', width: 12 },
        {
          header: 'Subject Combination',
          key: 'subject_combination',
          width: 12,
        },
      ];


      worksheet.columns = columns;
      let combsLength = 0;

      students.forEach(({
        // eslint-disable-next-line camelcase
        class_roll_no,
        name,
        // eslint-disable-next-line camelcase
        phone_number,
        // eslint-disable-next-line camelcase
        uni_roll_no,
        fatherName,
        motherName,
        // eslint-disable-next-line camelcase
        date_of_birth,
        gender,
        category,
        permanentAddress,
        // eslint-disable-next-line camelcase
        last_examination,
        branch,
        semester,
        subjectCombination,
        // eslint-disable-next-line camelcase
        profile_image,
      }, i) => {
        const combs = subjectCombination.map(sub => sub.code).sort();
        const filterSubCombs = subCombs.map(sub => (combs.includes(sub) ? sub : ''));
        combsLength = filterSubCombs.length;
        // if (combs.length > combsLength) {
        //   combsLength = combs.length;
        // }
        const row = [
          // eslint-disable-next-line camelcase
          class_roll_no,
          String(name).toUpperCase(),
          // eslint-disable-next-line camelcase
          uni_roll_no,
          // eslint-disable-next-line camelcase
          phone_number,
          String(fatherName).toUpperCase(),
          String(motherName).toUpperCase(),
          // eslint-disable-next-line camelcase
          date_of_birth,
          gender,
          category.type,
          `Village/Town: ${permanentAddress.vill_town}, PS/PO: ${permanentAddress.ps_po}, District: ${permanentAddress.district}, State: ${permanentAddress.state},PIN: ${permanentAddress.pin}`,
          last_examination.examination,
          last_examination.board_uni,
          last_examination.roll_no,
          last_examination.institution,
          last_examination.subjects.map(sub => sub.title).join(', '),
          last_examination.total_mark,
          last_examination.percentage,
          String(branch).toUpperCase(),
          semester,
          // ...combs,
          // ...sortedSubjectCombination[i],
          ...filterSubCombs,
        ];
        worksheet.addRow(row);
        if (photo === 'yes') {
          // row = [' ', ...row];
          worksheet.getRow(i + 2).height = 80;
          worksheet.addImage(workbook.addImage({
            filename: profile_image.path,
            extension: 'jpeg',
          }),
          {
            tl: { col: columns.length + combsLength - 1, row: i + 1 },
            br: { col: columns.length + combsLength, row: i + 2 },
          });
        }
      });

      const fromCell = 65 + columns.length - 1;
      const toCell = fromCell + combsLength - 1;
      worksheet.mergeCells(`${String.fromCharCode(fromCell)}1:${String.fromCharCode(toCell)}1`);
    }


    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    return res.status(500).send();
  }
};


const readStudentXL = async (req, res) => {
  try {
    // const workbook = new Excel.Workbook();

    // const wb = await workbook.xlsx.load(req.file.buffer);
    // // console.log('A1', sheet.getCell('A1').value);
    // // const worksheet = wb.addWorksheet('MySheet');
    res.send({ msg: 'success' });
  } catch (error) {
    res.status(500).send();
  }
};


const downloadFacultiesSheet = async (req, res) => {
  try {
    // const faculties = await Faculty.find()
    //   .sort('department')
    //   .populate('department');
    // console.log(faculties);
    res.send({ success: 'ha' });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  downloadApplicantSheet,
  downloadStudentsSheet,
  downloadFacultiesSheet,
  readStudentXL,
  // downloadStudentsSheet2,
};
