FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["src/Football.Is.Life.Identity.Host/Football.Is.Life.Identity.Host.csproj", "Football.Is.Life.Identity.Host/"]
COPY ["src/Football.Is.Life.Core/Football.Is.Life.Core.csproj", "Football.Is.Life.Core/"]
RUN dotnet restore "Football.Is.Life.Identity.Host/Football.Is.Life.Identity.Host.csproj"
COPY ./* /src/
WORKDIR "/src/Football.Is.Life.Identity.Host/"
RUN dotnet build "Football.Is.Life.Identity.Host.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Football.Is.Life.Identity.Host.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Football.Is.Life.Identity.Host.dll"]
