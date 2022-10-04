import axios from 'axios';

//Display All of Data
export const fetchRoleByFilter = async (currentPage, rowPerPage, searchKeyword) => {
  try {
    const response = await axios.get(`/api/role/filterBy/`,
      { params: { currentPage, rowPerPage, searchKeyword } }
    );
    if (response && response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

//Delete Data
export const deleteRole = async (data) => {
  //data => selected all of data
  try {
    const response = await axios.post('/api/role/delete', {
      //data.roleName => selected item's name
      roleName: data.roleName,
      //data.roleKey => selected item's key
      RoleKey: data.roleKey,
      RecordStatus: 'Deleted',


      // RoleKey: data.roleKey,
    });
    if (response && response.status === 200) {
      return response.data.status;
    }
  } catch (error) {
    console.error(error);
  }
};

//Selected Data By ID 
export const SelectByID = async (id) => {
  try {
    const response = await axios.get('/api/role/SelectById/',
      {
        params: { id }
      });
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
}

//Checked this data is already have in DB
export const fetchDuplicateRole = async (name) => {
  const filter = `where roleName = '${name}' and recordStatus = 'Active'`
  try {
    const response = await axios.get(`/api/role/GetDuplicateRole`,
      { params: { filter } });
    if (response && response.status === 200) {
      // console.log(`response => ${response.data}`);
      // response => 1
      return response.data;
    }
  }
  catch (error) {
  }
}

//Create Data
export const saveRole = async (values) => {
  const data = {
     // roleName: "CC"
    roleName: values.roleName,
    // recordStatus: "Active"
    recordStatus: values.recordStatus,
  }
  console.log("values", values);
  // values 
  // Objecterrors: []
  // formState: "new"
  // isLoading: true
  // messageVisible: true
  // recordStatus: "Active"
  // roleKey: ""
  // roleName: "AA"
  // rowKey: ""
  // successMessage: ""
  // [[Prototype]]: Object

  var response;
  console.log("data");
  console.log(data);
  // recordStatus: "Active"
  // roleName: "da"
  if (values.rowKey === "" || values.rowKey === null) {
    response = axios.post('/api/role/Create', data)
      .then(response => {
        console.log("response", response.data);
        // data: null
        // message: ""
        // status: true
        return response.data;
      })
      .catch(error => {
        return error;
      });
  } else {
    data.RoleKey = parseInt(values.roleKey);
    console.log("Role Update");
    console.log(data);
    // RoleKey: 1009
    // recordStatus: "Active"
    // roleName: "DD"
    response = axios.put('/api/role/Update', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        return error;
      });
  }
  return response;
};