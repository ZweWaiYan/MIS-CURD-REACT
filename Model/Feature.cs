using System;
using System.Collections.Generic;

namespace CBMMIS_WebApi.Model
{
    public class Feature
    {
        public int FeatureID { get; set; }
        public string MenuType { get; set; }
        public string MenuCode { get; set; }
        public string MenuGroupCode { get; set; }
        public string ModuleCode { get; set; }
        public string MenuName { get; set; }
        public string PageURL { get; set; }
        public string DefaultExpanse { get; set; }
        public string ExtendedPerm { get; set; }
        public string HiddenMenu { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
    }

    public class FeatureCollection
    {
        public int FeatureTotalRecord { get; set; }
        public List<Feature> FeatureRecords { get; set; }
    }
}