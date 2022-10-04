using System;
using System.Collections.Generic;

namespace CBMMIS_WebApi.Model
{
    public class PageFeature
    {
        public int PageFeatureID { get; set; }
        public string PageURL  { get; set; }
        public int FeatureID { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
    }

    public class PageFeatureCollection
    {
        public int PageFeatureTotalRecord { get; set; }
        public List<PageFeature> PageFeatureRecords { get; set; }
    }
}