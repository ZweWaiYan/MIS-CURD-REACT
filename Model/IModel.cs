using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CBMMIS_WebApi.Model
{
    //For Create , Update , Date
    public class ResultStatus
    {
        
        public bool Status { get; set; }
        public string Message { get; set; }
        public dynamic Data { get; set; }

        public ResultStatus()
        {
            Status = true;
            Message = string.Empty;
            Data = null;
        }
    }

}
