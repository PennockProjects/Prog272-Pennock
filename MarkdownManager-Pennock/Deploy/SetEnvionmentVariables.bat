@ECHO OFF

ECHO =========================
SetX GITHUB C:\Dev\Git
REM Setx GITHUB C:\Src\Git
set GITHUB C:\Dev\Git
SetX JSOBJECTS %GITHUB%\JsObjects
set	JSOBJECTS %GITHUB%\JsObjects
ECHO %JSOBJECTS%
SetX BASEJSO %JSOBJECTS%\Python
set BASEJSO %JSOBJECTS%\Python
SetX PYTHONPATH C:\Dev\Git\JsObjects;C:\Dev\Git\JsObjects\Utils;C:\Dev\Git\JsObjects\RegEx;
set PYTHONPATH %BASEJSO%;%BASEJSO%\Utils;%BASEJSO%\RegEx;
ECHO =========================
ECHO GITHUB = %GITHUB%
ECHO JSOBJECTS = %JSOBJECTS%
ECHO PYTHONPATH = %PYTHONPATH%
ECHO =========================
ECHO You will need to restart this command window 
ECHO before these variables take effect.
ECHO =========================