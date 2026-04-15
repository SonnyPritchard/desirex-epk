@echo off
title DesireX EPK - Dev Server
echo Starting DesireX EPK...
echo.
wsl -e bash -c "cd /home/sonny/jarvis-workspace/projects/desirex-epk && npm run dev"
pause
