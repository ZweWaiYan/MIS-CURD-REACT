import axios from 'axios';

export const SelectById = async (currentPage , rowPerPage , pageFeatureID) => {
    // console.log("currentPage , rowPerPage , pageFeatureID");
    //     console.log(currentPage , rowPerPage , pageFeatureID);
    try {
      const response = await axios.get('/api/pagefeature/filterBy/',
        {
          params: { currentPage , rowPerPage , pageFeatureID}
        });
        if (response && response.status === 200) {
            // console.log(response.data);
            // console.log(response.data);
            return response.data;
          }
    } catch (error) {
      console.error(error);
    }
  }

  export const deletePageFeature = async (data) => {
    try {
      const response = await axios.post(`/api/pagefeature/delete`, {
        pageFeatureID: data.pageFeatureID
,
      });
      if (response && response.status === 200) {
        return response.data.status;
      }
    } catch (error) {
      console.error(error);
    }
  };

  export const fetchDuplicatePageFeature = async (url) => {
    const filter = `where PageURL = '${url}'`
    try {
      const response = await axios.get(`/api/pagefeature/fetchDuplicatePageFeature`,
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

  export const savePageFeature = async (values) => {
    const data = {
      FeatureID: values.SaveFeatureID,
      pageURL: values.SaveURL,
    }
    console.log("values", values);
    var response;
    console.log("data");
    console.log(data);
    if (values.rowKey === "" || values.rowKey === null) {
      response = axios.post('/api/pagefeature/Create', data)
        .then(response => {
          console.log("response", response.data);
          return response.data;
        })
        .catch(error => {
          return error;
        });
    } 
    return response;
  }
    // else {
    //   data.RoleKey = parseInt(values.roleKey);
    //   console.log("Role Update");
    //   console.log(data);
    //   response = axios.put('/api/role/Update', data)
    //     .then(response => {
    //       return response.data;
    //     })
    //     .catch(error => {
    //       return error;
    //     });
    // }

    export const EditPageFeature = async (values) => {
      // console.log(values);
      const data = {
        PageFeatureID : parseInt(values.editPageFeatureID),
        FeatureID: values.editFeatureID,
        pageURL: values.editURL,
      }
      console.log(data);
      //PageFeatureID: 459, FeatureID: 6, pageURL: '/SoftwareIT/IOSSSSSS'
      var response = axios.put('/api/pagefeature/Update', data)
      .then(response => {
        // console.log(response.data);
        return response.data;
      })
      .catch(error => {
        return error;
      });
      return response;
    }
    
  