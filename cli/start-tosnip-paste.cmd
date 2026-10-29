@echo off
title ToSnip paste
powershell.exe -NoProfile -STA -ExecutionPolicy Bypass -File "%~dp0..\public\tosnip-paste.ps1"
