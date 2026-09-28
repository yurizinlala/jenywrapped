@echo off
setlocal
cd /d "%~dp0"
set "JENY_RUNTIME=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies"
where node >nul 2>nul
if errorlevel 1 (
  if exist "%JENY_RUNTIME%\node\bin\node.exe" (
    set "PATH=%JENY_RUNTIME%\node\bin;%PATH%"
    call "%JENY_RUNTIME%\bin\fallback\pnpm.cmd" dev
  ) else (
    echo Instale Node.js 20.9 ou superior e execute npm install e npm run dev.
    pause
  )
) else (
  where pnpm >nul 2>nul
  if errorlevel 1 (call npm run dev) else (call pnpm dev)
)
