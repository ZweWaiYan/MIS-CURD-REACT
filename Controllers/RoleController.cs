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

   public class RoleController : Controller
   {

        //Display All of Data
        //GET: api/role/filterBy
        [HttpGet("filterBy")]
        public ActionResult<RoleCollection> Get(int currentPage, int rowPerPage, string searchKeyword)
        {
            return RoleDA.SelectByFilter(currentPage, rowPerPage, searchKeyword);
        }
        
        //Delete Selected Item
        [HttpPost("[action]")]
        public ResultStatus Delete(Role item)
        {   
            //set UpdatedBy from Role > UpdatedBy
            item.UpdatedBy = "Admin";
            return RoleDA.Delete(item);
        }

        //Selected Item With ID
        // GET: api/User/6
        [HttpGet("[action]")]
        public ResultStatus SelectById(int id)
        {
            return RoleDA.SelectById(id);
        }

        //Checked this data is already have in DB
        //Get : api/duplicateRole
        [HttpGet("[action]")]
        public int GetDuplicateRole(string filter)
        {
            return RoleDA.GetDuplicateRole(filter);
        }

        //Create Data
         // POST: api/User  
        [HttpPost("[action]")]
        public ResultStatus Create(Role item)
        {
            item.UpdatedBy = "Admin";
            item.CreatedBy = "Admin";
            return RoleDA.Create(item);
        }

        //Update Data
          // PUT: api/User/
        [HttpPut("[action]")]
        public ResultStatus Update(Role item)
        {
            Console.WriteLine("Role Item RoleKey {0}",item.RoleKey);
            Console.WriteLine("Role Item RoleName  {0}",item.RoleName);
            item.UpdatedBy = "Admin";
            return RoleDA.Update(item);
        }
   }
}