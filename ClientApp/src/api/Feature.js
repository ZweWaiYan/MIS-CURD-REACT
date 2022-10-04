import axios from 'axios';

export const fetchFeatureByFilter = async (currentPage, rowPerPage) => {
  try {
    const response = await axios.get(`/api/feature/filterBy/`,
      { params: { currentPage, rowPerPage } }
    );
    if (response && response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteFeature = async (data) => {
  // console.log(data)
  console.log(data.menuGroupCode)
  {
    if(data.menuType === 'MG'){ 
     try {
      const response = await axios.post(`/api/feature/deleteGroup`, {        
        MenuGroupCode: data.menuGroupCode,
      });
      console.log(response);
      if (response && response.status === 200) {
        console.log(response.data);
        return response.data.status;
      }
    } catch (error) {
      console.error(error);
    }
    // console.log("Delete multis line")
  }else{
    try {
      const response = await axios.post(`/api/feature/delete`, {
            FeatureID: data.featureID,
      });
      if (response && response.status === 200) {
        return response.data.status;
      }
    } catch (error) {
      console.error(error);
    }
   
    // console.log("Delete Single line")
  }
  }
};

// export const deleteFeature = async (data) => {
//   console.log(data)
//   try {
//     const response = await axios.post(`/api/feature/delete`, {
//       FeatureID: data.featureID,
//     });
//     if (response && response.status === 200) {
//       return response.data.status;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

export const SelectByID = async (id) => {
  try {
    const response = await axios.get('/api/feature/SelectById/',
      {
        params: { id }
      });
    // console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
}

export const fetchDuplicateFeature = async (name, code, module, url, type) => {
  var filter;
  console.log(`where MenuName = '${name}' || MenuCode = '${code} || ModuleCode = '${module}' ||  PageURL = '${url}' || MenuType = '${type}'`);
  {
    type === "MG" ?
    filter = `where MenuName = '${name}' || MenuCode = '${code}' || ModuleCode = '${module}'`
    :
    filter = `where MenuName = '${name}' || MenuCode = '${code}' || ModuleCode = '${module}' ||  PageURL  = '${url}'`
  }
  // const filter = `where MenuName = '${name}' || MenuCode = '${code}' || ModuleCode = '${module}'`;
  try {
    const response = await axios.get(`/api/feature/GetDuplicateFeature`,
      { params: { filter } });
    if (response && response.status === 200) {
      return response.data;
    }
  }
  catch (error) {
  }
}

export const saveRole = async (values) => {
  const data = {
    MenuType: values.MenuType,
    MenuCode: values.MenuCode,
    MenuGroupCode: values.MenuGroupCode,
    ModuleCode: values.ModuleCode,
    MenuName: values.MenuName,
    PageURL: values.PageURL,
    DefaultExpanse: values.DefaultExpanse,
    ExtendedPerm: values.ExtendedPerm,
    HiddenMenu: values.HiddenMenu,
  }
  console.log("values", values);

  var response;
  if (values.rowKey === "" || values.rowKey === null) {
    console.log("data");
    console.log(data);
    response = axios.post('/api/feature/Create', data)
      .then(response => {
        console.log("response.data");
        console.log(response.data);
        return response.data;
      })
      .catch(error => {
        return error;
      });
  }
  else {
    data.FeatureID = parseInt(values.featureID);
    console.log("Feature Update");
    console.log(data);
    // RoleKey: 1009
    // recordStatus: "Active"
    // roleName: "DD"
    response = axios.put('/api/feature/Update', data)
      .then(response => {
        return response.data;
        console.log("response.data");
        console.log(response.data);
      })
      .catch(error => {
        return error;
      });
  }
  return response;
};

