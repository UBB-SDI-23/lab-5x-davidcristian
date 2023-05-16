# Use the official .NET 7 SDK image as the base image
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /app

# Copy the project file and restore the dependencies
COPY ./StoreAPI/StoreAPI/*.csproj ./
RUN dotnet restore

# Copy the rest of the project files and build the app
COPY ./StoreAPI/StoreAPI/* ./
RUN dotnet publish -c Release -o out

# Use the official .NET 7 Runtime image as the final image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/out .

ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://*:5066
ENTRYPOINT ["dotnet", "StoreAPI.dll"]
