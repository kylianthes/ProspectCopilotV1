!macro NSIS_HOOK_PREINSTALL
  DetailPrint "Closing running Prospect Copilot processes before install..."
  nsExec::ExecToLog 'taskkill /F /T /IM prospect-copilot-backend.exe'
  nsExec::ExecToLog 'taskkill /F /T /IM prospect-copilot.exe'
  Sleep 1000
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  DetailPrint "Closing running Prospect Copilot processes before uninstall..."
  nsExec::ExecToLog 'taskkill /F /T /IM prospect-copilot-backend.exe'
  nsExec::ExecToLog 'taskkill /F /T /IM prospect-copilot.exe'
  Sleep 1000
!macroend
