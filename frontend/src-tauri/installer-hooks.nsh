!macro NSIS_HOOK_PREINSTALL
  DetailPrint "Closing running Prospect Copilot processes before install..."
  ExecWait 'taskkill /F /T /IM prospect-copilot-backend.exe'
  ExecWait 'taskkill /F /T /IM prospect-copilot.exe'
  Sleep 2000
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  DetailPrint "Closing running Prospect Copilot processes before uninstall..."
  ExecWait 'taskkill /F /T /IM prospect-copilot-backend.exe'
  ExecWait 'taskkill /F /T /IM prospect-copilot.exe'
  Sleep 2000
!macroend

!macro NSIS_HOOK_POSTINSTALL
  DetailPrint "Registering prospectcopilot:// protocol..."
  WriteRegStr HKCU "Software\Classes\prospectcopilot" "" "URL:${BUNDLEID} protocol"
  WriteRegStr HKCU "Software\Classes\prospectcopilot" "URL Protocol" ""
  WriteRegStr HKCU "Software\Classes\prospectcopilot\DefaultIcon" "" "$\"$INSTDIR\${MAINBINARYNAME}.exe$\",0"
  WriteRegStr HKCU "Software\Classes\prospectcopilot\shell\open\command" "" "$\"$INSTDIR\${MAINBINARYNAME}.exe$\" $\"%1$\""
!macroend
