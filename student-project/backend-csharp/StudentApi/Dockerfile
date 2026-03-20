FROM mcr.microsoft.com/dotnet/sdk:7.0 AS builder
WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
COPY . ./
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
COPY --from=builder /app/publish ./
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD bash -c 'echo > /dev/tcp/localhost/5000' || exit 1
ENTRYPOINT ["dotnet", "StudentApi.dll"]
