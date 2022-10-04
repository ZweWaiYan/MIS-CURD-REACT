using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using System.Security.Cryptography;
using CBMMIS_WebApi.Model;
using System.Data.SqlClient;
using CBMMIS_Web;
using System.Data.Common;
using System.Data;

namespace CBMMIS_WebApi.DataAccess
{
    public class PageFeatureDA : BaseDA
    { 
        public PageFeatureDA()
        {}

        // public static ResultStatus SelectById(int id){
        //       PageFeature data  = new PageFeature();
        //     ResultStatus result  = new ResultStatus();

        //     string queryString = String.Format("SELECT * FROM tblpagefeature WHERE FeatureID={0}" , id);

        //     using (DbConnection connection = CreateMainConnection())
        //     {
        //          DbCommand cmd = connection.CreateCommand();
        //         cmd.CommandText = queryString;

        //          try
        //         {
        //         connection.Open();
        //         DbDataReader reader = cmd.ExecuteReader();
        //         while (reader.Read())
        //         {
        //             data = new PageFeature()
        //                 {
        //                     PageFeatureID = Convert.ToInt32(reader["PageFeatureID"]),
        //                     PageURL = reader["PageURL"].ToString(),
        //                     FeatureID = Convert.ToInt32(reader["FeatureID"]),
        //                     CreatedBy = reader["CreatedBy"].ToString(),
        //                     CreatedDate = DateTime.Parse(reader["CreatedDate"].ToString()),
        //                     UpdatedBy = (reader["UpdatedBy"] != System.DBNull.Value ? reader["UpdatedBy"].ToString() : ""),
        //                     UpdatedDate = (reader["UpdatedDate"] != System.DBNull.Value ? DateTime.Parse(reader["UpdatedDate"].ToString()) : DateTime.Now),
        //                 }; 
        //         }
        //         connection.Close();
        //         }
        //         catch(Exception exp)
        //         {
        //         result.Status = false;
        //         result.Message = exp.Message;
        //         return result;
        //         }
        //         finally
        //         {
        //         if(connection.State == ConnectionState.Open )
        //             connection.Close();
        //         }
        //     }
        //     result.Data = data;
        //     return result;
        // }   
        
          //Display All of Data
        //Display Data with RowParPage and SearchBox
        public static PageFeatureCollection SelectById(int currentPage, int rowPerPage, int pageFeatureID)
        {
            PageFeatureCollection Collections = new PageFeatureCollection();
            List<PageFeature> types = new List<PageFeature>();

           string queryString = String.Format("SELECT * FROM tblpagefeature WHERE FeatureID={0}" , pageFeatureID);

            if (currentPage > 0 && rowPerPage > 0)
            {
                if (DatabaseType == DatabaseType.MSSQL)
                {
                    queryString += " OFFSET " + (currentPage * rowPerPage - rowPerPage) + " ROWS FETCH NEXT " + rowPerPage + " ROWS ONLY; ";
                }
                else
                {
                    queryString += " LIMIT " + (currentPage * rowPerPage - rowPerPage) + ", " + rowPerPage;
                }
            }
            using (DbConnection connection = CreateMainConnection())
            {
                DbCommand cmd = connection.CreateCommand();
                cmd.CommandText = queryString;
                try
                {
                    connection.Open();
                    DbDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        types.Add(new PageFeature()
                        {
                            PageFeatureID = Convert.ToInt32(reader["PageFeatureID"]),
                            PageURL = reader["PageURL"].ToString(),
                            FeatureID = Convert.ToInt32(reader["FeatureID"]),
                            CreatedBy = reader["CreatedBy"].ToString(),
                            CreatedDate = DateTime.Parse(reader["CreatedDate"].ToString()),
                            UpdatedBy = (reader["UpdatedBy"] != System.DBNull.Value ? reader["UpdatedBy"].ToString() : ""),
                            UpdatedDate = (reader["UpdatedDate"] != System.DBNull.Value ? DateTime.Parse(reader["UpdatedDate"].ToString()) : DateTime.Now),
                        });
                    }
                    connection.Close();
                }
                catch (Exception exp)
                {
                    Console.WriteLine("exp {0}", exp.Message);
                }
                finally
                {
                    if (connection.State == ConnectionState.Open)
                        connection.Close();
                }
            }

            Collections.PageFeatureTotalRecord = GetTotalRocord();
            Collections.PageFeatureRecords = types;
            return Collections;
        }
        
         //Display All of Data
        public static int GetTotalRocord()
        {
            string queryString = String.Format("SELECT COUNT(1) FROM tblpagefeature");
            int recordCount = 0;

            DbConnection connection = CreateMainConnection();
            DbCommand cmd = connection.CreateCommand();
            try
            {
                cmd.CommandText = queryString;
                connection.Open();
                recordCount = Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception exp)
            {
                Console.WriteLine("GetTotalRecord Funciton exp {0}", exp.Message);
                recordCount = 0;
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                    connection.Close();
            }
            connection.Close();
            return recordCount;
        }

         public static ResultStatus Delete(PageFeature obj)
        {      
            ResultStatus result = new ResultStatus();
            string queryString = String.Format("DELETE FROM tblpagefeature WHERE PageFeatureID = {0}" , obj.PageFeatureID);
            DbConnection connection = CreateMainConnection();
            DbCommand cmd = connection.CreateCommand();

            try
            {
                cmd.CommandText = queryString;
                connection.Open();
                cmd.ExecuteNonQuery();
            }
            catch (Exception exp)
            {
                result.Status = false;
                result.Message = exp.Message;
            }
            finally
            {
                if(connection.State == ConnectionState.Open)
                    connection.Close();
            }
            connection.Close();
            return result;
        }

        public static int fetchDuplicatePageFeature(string filter)
        {
        string queryString = String.Format("SELECT COUNT(1) FROM tblpagefeature {0}",filter);
        int recordCount = 0; 
        DbConnection connection = CreateMainConnection();
        DbCommand cmd = connection.CreateCommand();
        try 
        {
            cmd.CommandText = queryString;
            connection.Open();
            recordCount = Convert.ToInt32(cmd.ExecuteScalar());
        }
        catch (Exception exp)
        {
            Console.WriteLine("GetTotalRecord Funciton exp {0}",exp.Message);
            recordCount = 0;
        }
        finally
        {
            if(connection.State == ConnectionState.Open )
            connection.Close();
        }
        connection.Close();
        return recordCount;
        }

         //Create Data
        public static ResultStatus Create(PageFeature obj)
        {
            ResultStatus result = new ResultStatus();
            List<PageFeature> types = new List<PageFeature>();
            string queryString = String.Format("INSERT INTO tblpagefeature (PageURL, FeatureID, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate)VALUES (@PageURL, @FeatureID, @CreatedBy, @CreatedDate,@UpdatedBy, @UpdatedDate);");
            if(DatabaseType == DatabaseType.MSSQL)
            {
            queryString += " SELECT PageFeatureID AS LastID FROM tblpagefeature WHERE PageFeatureID = @@Identity;";
            }
            else 
            {
            queryString += " Select LAST_INSERT_ID();";
            }
            // Create the parameters
            DbConnection connection = CreateMainConnection();
            DbCommand cmd = connection.CreateCommand();
            cmd.ParametersAddWithValue("PageURL", obj.PageURL);
            cmd.ParametersAddWithValue("FeatureID", obj.FeatureID);
            cmd.ParametersAddWithValue("CreatedBy",obj.CreatedBy);
            cmd.ParametersAddWithValue("CreatedDate", DateTime.Now);
            cmd.ParametersAddWithValue("UpdatedBy", obj.UpdatedBy);
            cmd.ParametersAddWithValue("UpdatedDate", DateTime.Now);

            try
            {
            cmd.CommandText = queryString;
            connection.Open();
            obj.PageFeatureID = Convert.ToInt32(cmd.ExecuteScalar()); // get role key
            }
            catch (Exception exp)
            {
                result.Status = false;
                result.Message = exp.Message;
            }
            finally
            {
                if(connection.State == ConnectionState.Open)
                    connection.Close();
            }
            connection.Close();
            return result;
        }

           //Update Data
        public static ResultStatus Update(PageFeature obj)
        {
        ResultStatus result = new ResultStatus();
        string queryString = String.Format("UPDATE tblpagefeature SET PageURL=@PageURL, FeatureID=@FeatureID, CreatedBy=@CreatedBy, CreatedDate=@CreatedDate, UpdatedBy=@UpdatedBy, UpdatedDate=@UpdatedDate where PageFeatureID=@PageFeatureID");

        // Create the parameters
        DbConnection connection = CreateMainConnection();
        DbCommand cmd = connection.CreateCommand();

        cmd.ParametersAddWithValue("PageFeatureID", Convert.ToInt32(obj.PageFeatureID.ToString()));
        cmd.ParametersAddWithValue("PageURL", obj.PageURL);
        cmd.ParametersAddWithValue("FeatureID", obj.FeatureID);
        cmd.ParametersAddWithValue("CreatedBy", obj.CreatedBy);
        cmd.ParametersAddWithValue("CreatedDate", DateTime.Now);
        cmd.ParametersAddWithValue("UpdatedBy", obj.UpdatedBy);
        cmd.ParametersAddWithValue("UpdatedDate", DateTime.Now);
        try
        {
            cmd.CommandText = queryString;
            connection.Open();
            cmd.ExecuteNonQuery();
        }
        catch (Exception exp)
        {
            result.Status = false;
            result.Message = exp.Message;
        }
        finally
        {
            if(connection.State == ConnectionState.Open)
                connection.Close();
        }
        connection.Close();
        return result;
        }
    }
}