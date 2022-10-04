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

    public class FeatureController : Controller
    {
        // GET: api/feature/filterBy
        [HttpGet("filterBy")]
        public ActionResult<FeatureCollection> Get(int currentPage, int rowPerPage)
        {
            return FeatureDA.SelectByFilter(currentPage, rowPerPage);
        }

         //Delete Selected Item
        [HttpPost("[action]")]
        public ResultStatus Delete(Feature item)
        {   
            return FeatureDA.Delete(item);
        }

          //Delete Selected Item
        [HttpPost("[action]")]
        public ResultStatus DeleteGroup(Feature item)
        {   
            return FeatureDA.DeleteGroup(item);
        }

         //Selected Item With ID
        // GET: api/User/6
        [HttpGet("[action]")]
        public ResultStatus SelectById(int id)
        {
            return FeatureDA.SelectById(id);
        }

         [HttpGet("[action]")]
        public int GetDuplicateFeature(string filter)
        {
            return FeatureDA.GetDuplicateFeature(filter);
        }

         [HttpPost("[action]")]
        public ResultStatus Create(Feature item)
        {
            item.UpdatedBy = "Admin";
            item.CreatedBy = "Admin";
            return FeatureDA.Create(item);
        }

        
        //Update Data
          // PUT: api/User/
        [HttpPut("[action]")]
        public ResultStatus Update(Feature item)
        {
            item.UpdatedBy = "Admin";
            item.CreatedBy = "Admin";
            return FeatureDA.Update(item);
        }
    }
}