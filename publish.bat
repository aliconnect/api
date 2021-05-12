@echo off
call npm publish --dry-run
pause
call npm publish --access public
pause
