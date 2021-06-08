@echo off
:start
cls
call npm publish --dry-run
pause
call npm publish --access public
pause
goto start
