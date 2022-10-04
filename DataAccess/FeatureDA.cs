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
    public class FeatureDA : BaseDA
    {
        public FeatureDA()
        { }

        public static FeatureCollection SelectByFilter(int currentPage, int rowPerPage)
        {
            FeatureCollection Collections = new FeatureCollection();
            List<Feature> types = new List<Feature>();

            string queryString = "select * FROM cbmmis_dev.tblfeature ORDER BY MenuGroupCode , MenuType = 'ME'";

            DbConnection connection = CreateMainConnection();
            DbCommand cmd = connection.CreateCommand();

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
                try
                {   
                    cmd.CommandText = queryString;
                    connection.Open();
                    DbDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        types.Add(new Feature()
                        {
                            FeatureID = Convert.ToInt32(reader["FeatureID"]),
                            MenuType = reader["MenuType"].ToString(),
                            MenuCode = reader["MenuCode"].ToString(),
                            MenuGroupCode = reader["MenuGroupCode"].ToString(),
                            ModuleCode = reader["ModuleCode"].ToString(),
                            MenuName = reader["MenuName"].ToString(),
                            PageURL = reader["PageURL"].ToString(),
                            DefaultExpanse = reader["DefaultExpanse"].ToString(),
                            ExtendedPerm = reader["ExtendedPerm"].ToString(),
                            HiddenMenu = reader["HiddenMenu"].ToString(),
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
            Collections.FeatureTotalRecord = GetTotalRocord();
            Collections.FeatureRecords = types;
            return Collections;
        }

        public static int GetTotalRocord()
        {
            string queryString = String.Format("SELECT COUNT(1) FROM tblfeature");
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

        //Delete Single Row
          public static ResultStatus Delete(Feature obj)
        {      
            ResultStatus result = new ResultStatus();
            string queryString = String.Format("DELETE FROM tblfeature WHERE FeatureID = {0}" , obj.FeatureID);
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

        //Delete multi row with Menutype
         public static ResultStatus DeleteGroup(Feature obj)
        {      
            ResultStatus result = new ResultStatus();
            string queryString = String.Format("DELETE FROM tblfeature WHERE MenuGroupCode = @MenuGroupCode");
            DbConnection connection = CreateMainConnection();
            DbCommand cmd = connection.CreateCommand();

            cmd.ParametersAddWithValue("MenuGroupCode", obj.MenuGroupCode);

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

            
          //Selected Item with ID
         public static ResultStatus SelectById(int id)
        {         
            Feature data  = new Feature();
            ResultStatus result  = new ResultStatus();
            string queryString = String.Format("SELECT * FROM tblfeature WHERE FeatureID={0}", id);
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
                    data = new Feature()
                        {
                            FeatureID = Convert.ToInt32(reader["FeatureID"]),
                            MenuType = reader["MenuType"].ToString(),
                            MenuCode = reader["MenuCode"].ToString(),
                            MenuGroupCode = reader["MenuGroupCode"].ToString(),
                            ModuleCode = reader["ModuleCode"].ToString(),
                            MenuName = reader["MenuName"].ToString(),
                            PageURL = reader["PageURL"].ToString(),
                            DefaultExpanse = reader["DefaultExpanse"].ToString(),
                            ExtendedPerm = reader["ExtendedPerm"].ToString(),
                            HiddenMenu = reader["HiddenMenu"].ToString(),
                            CreatedBy = reader["CreatedBy"].ToString(),
                            CreatedDate = DateTime.Parse(reader["CreatedDate"].ToString()),
                            UpdatedBy = (reader["UpdatedBy"] != System.DBNull.Value ? reader["UpdatedBy"].ToString() : ""),
                            UpdatedDate = (reader["UpdatedDate"] != System.DBNull.Value ? DateTime.Parse(reader["UpdatedDate"].ToString()) : DateTime.Now),
                        }; 
                }
                connection.Close();
                }
                catch(Exception exp)
                {
                result.Status = false;
                result.Message = exp.Message;
                return result;
                }
                finally
                {
                if(connection.State == ConnectionState.Open )
                    connection.Close();
                }
            }
            result.Data = data;
            return result;
        }

        public static int GetDuplicateFeature(string filter)
        {
        string queryString = String.Format("SELECT COUNT(1) FROM tblfeature {0} ",filter);
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

         public static ResultStatus Create(Feature obj)
        {
            ResultStatus result = new ResultStatus();
            List<Feature> types = new List<Feature>();
            string queryString = String.Format("INSERT INTO tblfeature (MenuType, MenuCode, MenuGroupCode, ModuleCode, MenuName, PageURL, DefaultExpanse, ExtendedPerm, HiddenMenu, CreatedBy,CreatedDate, UpdatedBy , UpdatedDate) VALUES ( @MenuType, @MenuCode,@MenuGroupCode, @ModuleCode, @MenuName, @PageURL, @DefaultExpanse, @ExtendedPerm ,@HiddenMenu, @CreatedBy, @CreatedDate, @UpdatedBy , @UpdatedDate);");
            if(DatabaseType == DatabaseType.MSSQL)
            {
            queryString += " SELECT FeatureID AS LastID FROM tblfeature WHERE FeatureID = @@Identity;";
            }
            else 
            {
            queryString += " Select LAST_INSERT_ID();";
            }
            // Create the parameters
            DbConnection connection = CreateMainConnection();
            DbCommand cmd = connection.CreateCommand();
            cmd.ParametersAddWithValue("MenuType", obj.MenuType);
            cmd.ParametersAddWithValue("MenuCode", obj.MenuCode);
            cmd.ParametersAddWithValue("MenuGroupCode", obj.MenuGroupCode);
            cmd.ParametersAddWithValue("ModuleCode", obj.ModuleCode);
            cmd.ParametersAddWithValue("MenuName", obj.MenuName);
            cmd.ParametersAddWithValue("PageURL", obj.PageURL);
            cmd.ParametersAddWithValue("DefaultExpanse", obj.DefaultExpanse);
            cmd.ParametersAddWithValue("ExtendedPerm", obj.ExtendedPerm);
            cmd.ParametersAddWithValue("HiddenMenu", obj.HiddenMenu);
            cmd.ParametersAddWithValue("CreatedBy", obj.CreatedBy);
            cmd.ParametersAddWithValue("CreatedDate", DateTime.Now);
            cmd.ParametersAddWithValue("UpdatedBy", obj.UpdatedBy);
            cmd.ParametersAddWithValue("UpdatedDate", DateTime.Now);
            
            try
            {
            cmd.CommandText = queryString;
            connection.Open();
            obj.FeatureID = Convert.ToInt32(cmd.ExecuteScalar()); // get role key
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

         public static ResultStatus Update(Feature obj)
        {
        ResultStatus result = new ResultStatus();
        string queryString = String.Format("UPDATE tblfeature SET MenuType=@MenuType, MenuCode=@MenuCode, MenuGroupCode=@MenuGroupCode, ModuleCode=@ModuleCode, MenuName=@MenuName, PageURL=@PageURL, DefaultExpanse=@DefaultExpanse, ExtendedPerm=@ExtendedPerm, HiddenMenu=@HiddenMenu, CreatedBy=@CreatedBy, CreatedDate=@CreatedDate, UpdatedBy=@UpdatedBy, UpdatedDate=@UpdatedDate where FeatureID=@FeatureID");

        // Create the parameters
        DbConnection connection = CreateMainConnection();
        DbCommand cmd = connection.CreateCommand();

            cmd.ParametersAddWithValue("FeatureID", Convert.ToInt32(obj.FeatureID.ToString()));
            cmd.ParametersAddWithValue("MenuType", obj.MenuType);
            cmd.ParametersAddWithValue("MenuCode", obj.MenuCode);
            cmd.ParametersAddWithValue("MenuGroupCode", obj.MenuGroupCode);
            cmd.ParametersAddWithValue("ModuleCode", obj.ModuleCode);
            cmd.ParametersAddWithValue("MenuName", obj.MenuName);
            cmd.ParametersAddWithValue("PageURL", obj.PageURL);
            cmd.ParametersAddWithValue("DefaultExpanse", obj.DefaultExpanse);
            cmd.ParametersAddWithValue("ExtendedPerm", obj.ExtendedPerm);
            cmd.ParametersAddWithValue("HiddenMenu", obj.HiddenMenu);
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