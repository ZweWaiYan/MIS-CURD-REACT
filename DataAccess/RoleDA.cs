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
    public class RoleDA : BaseDA
    {
        public RoleDA()
        { }

        //Display All of Data
        //Display Data with RowParPage and SearchBox
        public static RoleCollection SelectByFilter(int currentPage, int rowPerPage, string searchKeyword)
        {
            //Create Collection From Role.cs
            RoleCollection Collections = new RoleCollection();
            //Create types From Role.cs
            List<Role> types = new List<Role>();

            //Get All data from Role Table
            string queryGetAllData = "select * from tblrole";
            //It's RecordStatus is not 'Delete'
            string queryWhere = " WHERE RecordStatus != 'Delete' ";
            //The RoleName Must be include searchKeyword data where is it.
            string queryLIKE = " AND (RoleName LIKE '%" + searchKeyword + "%') ";
            //Order with RoleKey 1,2,3,......
            string queryOrderBy = " ORDER BY RoleKey";
            string queryString = queryGetAllData + queryWhere + queryLIKE + queryOrderBy;

            //if currentPage and rowPerpage is bigger than -1,-2.... or 0
            if (currentPage > 0 && rowPerPage > 0)
            {
                //check DataBase is MySQL or MicrosoftSQL
                if (DatabaseType == DatabaseType.MSSQL)
                {
                    queryString += " OFFSET " + (currentPage * rowPerPage - rowPerPage) + " ROWS FETCH NEXT " + rowPerPage + " ROWS ONLY; ";
                }
                else
                {
                    //how many data is display 
                    queryString += " LIMIT " + (currentPage * rowPerPage - rowPerPage) + ", " + rowPerPage;
                }
            }
            //Create Database connector
            using (DbConnection connection = CreateMainConnection())
            {
                //Create Command
                DbCommand cmd = connection.CreateCommand();
                //set Query to Command
                cmd.CommandText = queryString;
                try
                {
                    //open DB
                    connection.Open();
                    //Retrieve the data
                    DbDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        //add data to types (Roles.cs/List<Role>)
                        types.Add(new Role()
                        {
                            RoleKey = Convert.ToInt32(reader["RoleKey"]),
                            RoleName = reader["RoleName"].ToString(),
                            RecordStatus = reader["RecordStatus"].ToString(),
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
                    //if database is still openning
                    if (connection.State == ConnectionState.Open)
                        connection.Close();
                }
            }
            //Add record to Role.cs/RoleCollection/TotalRecord
            Collections.TotalRecord = GetTotalRocord();
            //Add data to Role.cs/RoleCollection/TotalRecord
            Collections.Records = types;
            //return this data if you call this function
            return Collections;
        }

        //Display All of Data
        public static int GetTotalRocord()
        {
            //get first column , first row and how many has data in this table
            string queryString = String.Format("SELECT COUNT(1) FROM tblrole WHERE RecordStatus != 'Delete'");
            int recordCount = 0;

            DbConnection connection = CreateMainConnection();
            DbCommand cmd = connection.CreateCommand();
            try
            {
                cmd.CommandText = queryString;
                connection.Open();
                //ExecuteScalar() => The first column of the first row in the result set / Count(1) : 12
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

        //Delete Selected Data
        public static ResultStatus Delete(Role obj)
        {      
            //Just Updated from DB Guzzzz....
            ResultStatus result = new ResultStatus();
            // string queryString = String.Format("update tblrole set RecordStatus=@RecordStatus, UpdatedBy=@UpdatedBy, UpdatedDate=@UpdatedDate where RoleKey={0}", obj.RoleKey);
            string queryString = String.Format("update tblrole set RecordStatus=@RecordStatus, UpdatedBy=@UpdatedBy, UpdatedDate=@UpdatedDate where RoleKey=@RoleKey");
            DbConnection connection = CreateMainConnection();
            DbCommand cmd = connection.CreateCommand();

            // Create the parameters
            // set RoleKey = selected item's key
            cmd.ParametersAddWithValue("RoleKey", obj.RoleKey);
            //set RecordStatus = delete text
            cmd.ParametersAddWithValue("RecordStatus", "Delete");
            //set UpdatedBy = get UpdatedBy from Role.cs
            cmd.ParametersAddWithValue("UpdatedBy", obj.UpdatedBy);
            //set UpdatedDate = get DateTime from DateTIme liberity
            cmd.ParametersAddWithValue("UpdatedDate", DateTime.Now);

            //Delete from DB
            // string queryString = String.Format("DELETE FROM tblrole WHERE RoleKey = {0}" , obj.RoleKey);
            // cmd.ParametersAddWithValue("RoleKey", obj.RoleKey);

            try
            {
                cmd.CommandText = queryString;
                connection.Open();
                //set parameters to queryString and save to DB
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
            //Create data types From Role.cs
            Role data  = new Role();
            ResultStatus result  = new ResultStatus();
            string queryString = String.Format("SELECT * FROM tblrole WHERE RoleKey={0}", id);
            //Create DB Connector
            using (DbConnection connection = CreateMainConnection())
            {   
                //Create Command
                DbCommand cmd = connection.CreateCommand();
                //Add queryString to command
                cmd.CommandText = queryString;
                try
                {
                connection.Open();
                 //Retrieve the data
                DbDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    data = new Role()
                    {
                    RoleKey = Convert.ToInt32(reader["RoleKey"]),
                    RoleName = reader["RoleName"].ToString(),
                    RecordStatus = reader["RecordStatus"].ToString(),
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
            //if user finded item is has in DB return that Data
            result.Data = data;
            return result;
        }

        //Create Data
        public static ResultStatus Create(Role obj)
        {
            ResultStatus result = new ResultStatus();
            List<Role> types = new List<Role>();
            string queryString = String.Format("INSERT INTO tblrole ( RoleName, RecordStatus, CreatedBy, CreatedDate,UpdatedBy,UpdatedDate ) VALUES ( @RoleName, @RecordStatus, @CreatedBy, @CreatedDate,@UpdatedBy, @UpdatedDate );");
            if(DatabaseType == DatabaseType.MSSQL)
            {
            queryString += " SELECT RoleKey AS LastID FROM tblrole WHERE RoleKey = @@Identity;";
            }
            else 
            {
            queryString += " Select LAST_INSERT_ID();";
            }
            // Create the parameters
            DbConnection connection = CreateMainConnection();
            DbCommand cmd = connection.CreateCommand();
            cmd.ParametersAddWithValue("RoleName", obj.RoleName);
            cmd.ParametersAddWithValue("RecordStatus", obj.RecordStatus);
            cmd.ParametersAddWithValue("CreatedBy", obj.CreatedBy);
            cmd.ParametersAddWithValue("CreatedDate", DateTime.Now);
            cmd.ParametersAddWithValue("UpdatedBy", obj.UpdatedBy);
            cmd.ParametersAddWithValue("UpdatedDate", DateTime.Now);

            try
            {
            cmd.CommandText = queryString;
            connection.Open();
            obj.RoleKey = Convert.ToInt32(cmd.ExecuteScalar()); // get role key
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

        //Checked this data is already have in DB , if data same have 1 item it return 1 , if 0 it return 0
        public static int GetDuplicateRole(string filter)
        {
            //string queryString = String.Format("SELECT COUNT(1) FROM tblrole {0}{1} ",filter,filter);
        string queryString = String.Format("SELECT COUNT(1) FROM tblrole {0} ",filter);
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

        //Update Data
        public static ResultStatus Update(Role obj)
        {
        ResultStatus result = new ResultStatus();
        string queryString = String.Format("UPDATE tblrole SET RoleName=@RoleName,RecordStatus=@RecordStatus, UpdatedBy=@UpdatedBy, UpdatedDate=@UpdatedDate where RoleKey=@RoleKey");

        // Create the parameters
        DbConnection connection = CreateMainConnection();
        DbCommand cmd = connection.CreateCommand();

        cmd.ParametersAddWithValue("RoleKey", Convert.ToInt32(obj.RoleKey.ToString()));
        cmd.ParametersAddWithValue("RoleName", obj.RoleName);
        cmd.ParametersAddWithValue("RecordStatus", obj.RecordStatus);
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