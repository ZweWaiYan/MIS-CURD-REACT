using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CBMMIS_WebApi.Model;
using CBMMIS_WebApi.DataAccess;
using Newtonsoft.Json;

namespace CBMMIS_WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class PageFeatureController : Controller
    {
        //  //Selected Item With ID
        // // GET: api/User/6
        // [HttpGet("[action]")]
        // public ResultStatus SelectById(int id)
        // {
        //     return PageFeatureDA.SelectById(id);
        // }

            //Display All of Data
        //GET: api/role/filterBy
        [HttpGet("filterBy")]
        public ActionResult<PageFeatureCollection> Get(int currentPage, int rowPerPage, int pageFeatureID)
        {
            return PageFeatureDA.SelectById(currentPage, rowPerPage, pageFeatureID);
        }
        
         [HttpPost("[action]")]
        public ResultStatus Delete(PageFeature item)
        {   
            //set UpdatedBy from Role > UpdatedBy
            item.UpdatedBy = "Admin";
            return PageFeatureDA.Delete(item);
        }

          //Checked this data is already have in DB
        //Get : api/duplicateRole
        [HttpGet("[action]")]
        public int fetchDuplicatePageFeature(string filter)
        {
            return PageFeatureDA.fetchDuplicatePageFeature(filter);
        }

        //Create Data
         // POST: api/User  
        [HttpPost("[action]")]
        public ResultStatus Create(PageFeature item)
        {
            item.UpdatedBy = "Admin";
            item.CreatedBy = "Admin";
            return PageFeatureDA.Create(item);
        }

           //Update Data
          // PUT: api/User/
        [HttpPut("[action]")]
        public ResultStatus Update(PageFeature item)
        {
            item.UpdatedBy = "Admin";
            return PageFeatureDA.Update(item);
        }
    }
}