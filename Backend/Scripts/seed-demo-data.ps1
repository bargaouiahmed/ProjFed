param(
    [string]$Environment = "Development",
    [switch]$NoBuild
)

$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDirectory = Resolve-Path (Join-Path $scriptDirectory "..")
$workspaceDirectory = Resolve-Path (Join-Path $backendDirectory "..")

$env:ASPNETCORE_ENVIRONMENT = $Environment
$env:DOTNET_ENVIRONMENT = $Environment
$env:DOTNET_CLI_HOME = Join-Path $workspaceDirectory ".dotnet"

if (!(Test-Path $env:DOTNET_CLI_HOME)) {
    New-Item -ItemType Directory -Path $env:DOTNET_CLI_HOME | Out-Null
}

Push-Location $backendDirectory
try {
    if ($NoBuild) {
        dotnet run --no-build --project .\Backend.csproj -- --seed-demo-data
    }
    else {
        dotnet run --project .\Backend.csproj -- --seed-demo-data
    }
}
finally {
    Pop-Location
}
