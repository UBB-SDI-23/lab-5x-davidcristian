using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.ML;
using Microsoft.ML.Data;
using System.Globalization;

namespace StoreML
{
    public class Employee
    {
        [LoadColumn(0)]
        public int EmployeeId { get; set; }

        [LoadColumn(1)]
        public string? FirstName { get; set; }

        [LoadColumn(2)]
        public string? LastName { get; set; }

        [LoadColumn(3)]
        public int Gender { get; set; }

        [LoadColumn(4)]
        public DateTime EmploymentDate { get; set; }

        [LoadColumn(5)]
        public DateTime? TerminationDate { get; set; }

        [LoadColumn(6)]
        public float Salary { get; set; }

        [LoadColumn(7)]
        public int RoleId { get; set; }

        [LoadColumn(8)]
        public int UserId { get; set; }
    }

    public class EmployeeRole
    {
        [LoadColumn(0)]
        public int RoleId { get; set; }

        [LoadColumn(1)]
        public string? RoleName { get; set; }

        [LoadColumn(2)]
        public string? Description { get; set; }

        [LoadColumn(3)]
        public int Level { get; set; }

        [LoadColumn(4)]
        public int UserId { get; set; }
    }

    public class EmployeeInput
    {
        public string? Role { get; set; }
        public int Tenure { get; set; }
     
        [ColumnName("Label")]
        public float Salary { get; set; }
    }

    public class EmployeeOutput
    {
        [ColumnName("Score")]
        public float Salary { get; set; }
    }

    internal class Program
    {
        public static IEnumerable<Employee> LoadEmployees(string filePath, int limit = -1)
        {
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = false,
            };

            using (var reader = new StreamReader(filePath))
            using (var csv = new CsvReader(reader, config))
            {
                var records = csv.GetRecords<Employee>();

                if (limit > 0)
                    records = records.Take(limit);

                return records.ToList();
            }
        }

        public static IEnumerable<EmployeeRole> LoadEmployeeRoles(string filePath, int limit = -1)
        {
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = false,
            };

            using (var reader = new StreamReader(filePath))
            using (var csv = new CsvReader(reader, config))
            {
                var records = csv.GetRecords<EmployeeRole>();

                if (limit > 0)
                    records = records.Take(limit);

                return records.ToList();
            }
        }

        public static IEnumerable<EmployeeInput> ProcessData(IEnumerable<Employee> employees, IEnumerable<EmployeeRole> roles)
        {
            var today = DateTime.Today;

            foreach (var employee in employees)
            {
                var terminationDate = employee.TerminationDate ?? today;
                var tenure = (int)(terminationDate - employee.EmploymentDate).TotalDays;
                var role = roles.FirstOrDefault(r => r.RoleId == employee.RoleId);

                if (role != null)
                {
                    yield return new EmployeeInput
                    {
                        Salary = employee.Salary,
                        Role = role.RoleName,
                        Tenure = tenure
                    };
                }
            }
        }

        static void train()
        {
            Console.WriteLine("Training model...");

            int limit = 100_000;

            var employees = LoadEmployees("employees.csv", limit);
            var employeeRoles = LoadEmployeeRoles("employee_roles.csv", limit);

            var data = ProcessData(employees, employeeRoles).ToList();

            var mlContext = new MLContext();

            var dataView = mlContext.Data.LoadFromEnumerable(data);

            var dataSplit = mlContext.Data.TrainTestSplit(dataView, testFraction: 0.2);

            var pipeline = mlContext.Transforms.Conversion.MapValueToKey("Role")
                .Append(mlContext.Transforms.Conversion.ConvertType("Tenure", outputKind: DataKind.Single))
                .Append(mlContext.Transforms.Categorical.OneHotEncoding("Role"))
                .Append(mlContext.Transforms.NormalizeMinMax("Tenure"))
                .Append(mlContext.Transforms.Concatenate("Features", "Role", "Tenure"))
                .Append(mlContext.Transforms.NormalizeMinMax("Features"))
                .Append(mlContext.Regression.Trainers.FastTree());

            var model = pipeline.Fit(dataSplit.TrainSet);

            // Evaluate the model
            var predictions = model.Transform(dataSplit.TestSet);
            var metrics = mlContext.Regression.Evaluate(predictions, "Label", "Score");
            Console.WriteLine($"R-squared: {metrics.RSquared}");
            Console.WriteLine($"Root Mean Squared Error (RMSE): {metrics.RootMeanSquaredError}");

            string workingDirectory = Environment.CurrentDirectory;
            string projectDirectory = Directory.GetParent(workingDirectory)!.Parent!.Parent!.FullName;
            var modelsDirectory = Path.Combine(projectDirectory, "models");
            Console.WriteLine($"Models directory: {modelsDirectory}");

            Directory.CreateDirectory(modelsDirectory);

            var modelPath = Path.Combine(modelsDirectory, "salary_model.zip");
            mlContext.Model.Save(model, dataView.Schema, modelPath);

            Console.WriteLine($"Model saved to {modelPath}");
        }

        static void predict()
        {
            // Load the model
            var mlContext = new MLContext();
            var modelPath = "models/salary_model.zip";
            var model = mlContext.Model.Load(modelPath, out var modelSchema);

            // Create a prediction engine
            var predictionEngine = mlContext.Model.CreatePredictionEngine<EmployeeInput, EmployeeOutput>(model);

            // Prepare input data
            var input = new EmployeeInput
            {
                Role = "Editorial assistant",
                Tenure = 115
            };

            // Make predictions
            var prediction = predictionEngine.Predict(input);

            // Print prediction
            Console.WriteLine($"Predicted salary: {prediction.Salary}");
        }

        static void Main(string[] args)
        {
            train();
            predict();
        }
    }
}
