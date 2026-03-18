FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
ARG DOTNET_ENVIRONMENT=Production
ARG APP_PORT=8080
WORKDIR /src

COPY ["Backend.csproj", "./"]
RUN dotnet restore "Backend.csproj"

COPY . .
RUN dotnet publish "Backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
ARG DOTNET_ENVIRONMENT=Production
ARG APP_PORT=8080
WORKDIR /app
COPY --from=build /app/publish .

ENV DOTNET_ENVIRONMENT=$DOTNET_ENVIRONMENT
ENV ASPNETCORE_URLS=http://+:$APP_PORT
EXPOSE 8080

ENTRYPOINT ["dotnet", "Backend.dll"]
