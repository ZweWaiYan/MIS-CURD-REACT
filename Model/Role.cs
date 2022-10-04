using System;
using System.Collections.Generic;

namespace CBMMIS_WebApi.Model
{
  //Display All of Data
  //What data we save From RoleDA.cs (SelecctByFilter)
  public class Role
  {
    public int RoleKey { get; set; }
    public string RoleName { get; set; }
    public string RecordStatus { get; set; }
    public string CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public string UpdatedBy { get; set; }
    public DateTime UpdatedDate { get; set; }
  }

    //Display All of Data
    //Store Data from RoleDA.cs (SelecctByFilter)
    public class RoleCollection
  {
    public int TotalRecord { get; set; }
    public List<Role> Records { get; set; }
  }
}
