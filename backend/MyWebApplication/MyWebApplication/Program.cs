using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json.Serialization;

// Enable CORS
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

// Enable CORS
builder.Services.AddCors(options => options.AddPolicy(name: MyAllowSpecificOrigins,
                    policy => policy.WithOrigins("http://example.com", "http://www.contoso.com")));
//builder.Services.AddCors(options => options.AddPolicy(name: MyAllowSpecificOrigins, policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// (Default) JSON Serialiser
builder.Services.AddControllersWithViews().AddNewtonsoftJson(x => 
            x.SerializerSettings.ReferenceLoopHandling=Newtonsoft.Json.ReferenceLoopHandling.Ignore)
            .AddNewtonsoftJson(x => x.SerializerSettings.ContractResolver = new DefaultContractResolver());


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins); // Enable CORS
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Photos")),
    RequestPath = "/Photos"
});
app.UseAuthorization();
app.MapControllers();
app.Run();
