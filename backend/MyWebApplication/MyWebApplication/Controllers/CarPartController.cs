using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using MyWebApplication.Models;
using System.Net.Http.Headers;

namespace MyWebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarPartController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnv;
        public CarPartController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            string query = @"
                            SELECT PartId, PartName, CarModel, PhotoFilePath
                            FROM dbo.CarPart
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
        public JsonResult Post(CarPart part)
        {
            string query = @"
                            INSERT INTO dbo.CarPart
                            (PartName, CarModel, PhotoFilePath)
                            VALUES (@PartName, @CarModel, @PhotoFilePath)
                            ";

            DataTable dt = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("PlaygroundAppCon");
            SqlDataReader myReader;

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myCommand.Parameters.AddWithValue("@PartName", part.PartName);
                    myCommand.Parameters.AddWithValue("@CarModel", part.CarModel);
                    myCommand.Parameters.AddWithValue("@PhotoFilePath", part.PhotoFilePath);
                    myReader = myCommand.ExecuteReader();
                    dt.Load(myReader);
                    myReader.Close();
                    myConnection.Close();
                }
            }

            return new JsonResult("Added successfully");
        }

        [HttpPut]
        public JsonResult Put(CarPart part)
        {
            string query = @"
                            UPDATE dbo.CarPart
                            SET PartName=@PartName,
                                CarModel=@CarModel,
                                PhotoFilePath=@PhotoFilePath
                            WHERE PartId=@PartId
                            ";

            DataTable dt = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("PlaygroundAppCon");
            SqlDataReader myReader;

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myCommand.Parameters.AddWithValue("@PartId", part.PartId);
                    myCommand.Parameters.AddWithValue("@PartName", part.PartName);
                    myCommand.Parameters.AddWithValue("@CarModel", part.CarModel);
                    myCommand.Parameters.AddWithValue("@PhotoFilePath", part.PhotoFilePath);
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
                            DELETE FROM dbo.CarPart
                            WHERE PartId=@PartId
                            ";

            DataTable dt = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("PlaygroundAppCon");
            SqlDataReader myReader;

            using (SqlConnection myConnection = new SqlConnection(sqlDataSource))
            {
                myConnection.Open();

                using (SqlCommand myCommand = new SqlCommand(query, myConnection))
                {
                    myCommand.Parameters.AddWithValue("@PartId", id);
                    myReader = myCommand.ExecuteReader();
                    dt.Load(myReader);
                    myReader.Close();
                    myConnection.Close();
                }
            }

            return new JsonResult("Deleted successfully");
        }

    }
}
