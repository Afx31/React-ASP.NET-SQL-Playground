using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using MyWebApplication.Models;
using System.Net.Http.Headers;

namespace MyWebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnv;
        public EmployeeController(IConfiguration configuration, IWebHostEnvironment webHostEnv)
        {
            _configuration = configuration;
            _webHostEnv = webHostEnv;
        }

        [HttpGet]
        public JsonResult Get()
        {
            string query = @"
                            SELECT EmployeeId, EmployeeName, Department,
                            convert(varchar(10), DateOfJoining, 120) AS DateOfJoining, PhotoFileName
                            FROM dbo.Employee
                            ";

            DataTable dt = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("PlaygroundAppCon");
            SqlDataReader myReader;

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myReader = myCommand.ExecuteReader();
                    dt.Load(myReader);
                    myReader.Close();
                    myConnection.Close();
                }
            }

            return new JsonResult(dt);
        }

        [HttpPost]
        public JsonResult Post(Employee emp)
        {
            string query = @"
                            INSERT INTO dbo.Employee
                            (EmployeeName, Department, DateOfJoining, PhotoFileName)
                            VALUES (@EmployeeName, @Department, @DateOfJoining, @PhotoFileName)
                            ";

            DataTable dt = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("PlaygroundAppCon");
            SqlDataReader myReader;

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myCommand.Parameters.AddWithValue("@EmployeeName", emp.EmployeeName);
                    myCommand.Parameters.AddWithValue("@Department", emp.Department);
                    myCommand.Parameters.AddWithValue("@DateOfJoining", emp.DateOfJoining);
                    myCommand.Parameters.AddWithValue("@PhotoFileName", emp.PhotoFileName);
                    myReader = myCommand.ExecuteReader();
                    dt.Load(myReader);
                    myReader.Close();
                    myConnection.Close();
                }
            }

            return new JsonResult("Added successfully");
        }

        [HttpPut]
        public JsonResult Put(Employee emp)
        {
            string query = @"
                            UPDATE dbo.Employee
                            SET EmployeeName=@EmployeeName,
                                Department=@Department,
                                DateOfJoining=@DateOfJoining
                                PhotoFileName=@PhotoFileName
                            WHERE EmployeeId=@EmployeeId
                            ";

            DataTable dt = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("PlaygroundAppCon");
            SqlDataReader myReader;

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myCommand.Parameters.AddWithValue("@EmployeeId", emp.EmployeeId);
                    myCommand.Parameters.AddWithValue("@EmployeeName", emp.EmployeeName);
                    myCommand.Parameters.AddWithValue("@Department", emp.Department);
                    myCommand.Parameters.AddWithValue("@DateOfJoining", emp.DateOfJoining);
                    myCommand.Parameters.AddWithValue("@PhotoFileName", emp.PhotoFileName);
                    myReader = myCommand.ExecuteReader();
                    dt.Load(myReader);
                    myReader.Close();
                    myConnection.Close();
                }
            }

            return new JsonResult("Updated succesfully");
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"
                            DELETE FROM dbo.Employee
                            WHERE EmployeeId=@EmployeeId
                            ";

            DataTable dt = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("PlaygroundAppCon");
            SqlDataReader myReader;

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myCommand.Parameters.AddWithValue("@EmployeeId", id);
                    myReader = myCommand.ExecuteReader();
                    dt.Load(myReader);
                    myReader.Close();
                    myConnection.Close();
                }
            }

            return new JsonResult("Deleted successfully");
        }

        [Route("SaveFile")]
        [HttpPost]
        public JsonResult SaveFile()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string filename = postedFile.FileName;
                var physicalPath = _webHostEnv.ContentRootPath + "/Photos/" + filename;

                using (var stream = new FileStream(physicalPath, FileMode.Create))
                    postedFile.CopyTo(stream);

                return new JsonResult(filename);
            }
            catch (Exception)
            {
                return new JsonResult("annoymous.png");
            }
        }

        #region Photo ~ Binary
        [Route("SavePhotoBinary")]
        [HttpPost]
        public JsonResult SavePhotoBinary()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string filename = postedFile.FileName;

                // Option1
                byte[] uploadBytes = null;
                if (postedFile.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(postedFile.ContentDisposition).FileName.Trim('"');
                    using (var reader = new StreamReader(postedFile.OpenReadStream()))
                    {
                        string contentAsString = reader.ReadToEnd();
                        uploadBytes = new byte[contentAsString.Length * sizeof(char)];
                        System.Buffer.BlockCopy(contentAsString.ToCharArray(), 0, uploadBytes, 0, uploadBytes.Length);
                    }
                }

                #region temp
                // Option 2
                //string uploadString2 = "";
                //if (postedFile.Length > 0)
                //{
                //    using (var ms = new MemoryStream())
                //    {
                //        postedFile.CopyTo(ms);
                //        var fileBytes = ms.ToArray();
                //        uploadString2 = Convert.ToBase64String(fileBytes);
                //         act on the Base64 data
                //    }
                //}
                #endregion

                ///////////////////////////////////////////////////////////////////////////////////////

                string query = @"
                            INSERT INTO dbo.EmployeePhoto
                            (PhotoName, PhotoData)
                            VALUES(@PhotoName, @PhotoData)
                            ";
                DataTable dt = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("PlaygroundAppCon");
                SqlDataReader myReader;
                using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
                {
                    myConnection.Open();

                    using (SqlCommand cmd = new SqlCommand(query, myConnection))
                    {
                        cmd.Parameters.AddWithValue("@PhotoName", filename);
                        cmd.Parameters.AddWithValue("@PhotoData", uploadBytes);
                        myReader = cmd.ExecuteReader();
                        dt.Load(myReader);
                        myReader.Close();
                        myConnection.Close();
                    }
                }

                return new JsonResult("Uploaded Successfully: " + filename);

                #region temp
                //byte[] bytes;
                //using (BinaryReader br = new BinaryReader(FileUpload1.PostedFile.InputStream))
                //{
                //    bytes = br.ReadBytes(FileUpload1.PostedFile.ContentLength);
                //}
                //string constr = ConfigurationManager.ConnectionStrings["constr"].ConnectionString;
                //using (SqlConnection conn = new SqlConnection(constr))
                //{
                //    string sql = "INSERT INTO tblFiles VALUES(@Name, @ContentType, @Data)";
                //    using (SqlCommand cmd = new SqlCommand(sql, conn))
                //    {
                //        cmd.Parameters.AddWithValue("@Name", Path.GetFileName(FileUpload1.PostedFile.FileName));
                //        cmd.Parameters.AddWithValue("@ContentType", FileUpload1.PostedFile.ContentType);
                //        cmd.Parameters.AddWithValue("@Data", bytes);
                //        conn.Open();
                //        cmd.ExecuteNonQuery();
                //        conn.Close();
                //    }
                //}

                //Response.Redirect(Request.Url.AbsoluteUri);
                #endregion
            }
            catch (Exception)
            {
                return new JsonResult("annoymous.png");
            }
        }

        [Route("GetPhotoBinary")]
        [HttpGet]
        public JsonResult GetPhotoBinary()
        {
            string query = @"
                            SELECT PhotoId, PhotoName, PhotoData
                            FROM dbo.EmployeePhoto
                            WHERE PhotoId = 1
                            ";

            DataTable dt = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("PlaygroundAppCon");
            SqlDataReader myReader;

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myReader = myCommand.ExecuteReader();
                    dt.Load(myReader);
                    myReader.Close();
                    myConnection.Close();
                }
            }

            return new JsonResult(dt);
        }
        #endregion

    }
}
