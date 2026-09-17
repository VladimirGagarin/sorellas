$f = "C:\Emily_Backup\Desktop\cottolengo-suors\src\components\Utils.js"
$c = Get-Content $f
$n = $c.Count
Write-Output ("TOTAL: " + $n)

function Get-FnEnd([int]$start) {
  # find matching closing brace of function starting at $start (line 1-based); braces on lines
  $depth = 0
  for ($i = $start; $i -le $n; $i++) {
    foreach ($ch in $c[$i-1].ToCharArray()) {
      if ($ch -eq '{') { $depth++ }
      elseif ($ch -eq '}') {
        $depth--
        if ($depth -eq 0) { return $i }
      }
    }
  }
  return -1
}

function Show-Close([string]$kind, [string]$desc, [int]$fnStart, [string]$closePattern) {
  $end = Get-FnEnd $fnStart
  Write-Output ("===== " + $kind + " : " + $desc + " (fn start " + $fnStart + " -> end " + $end + ") =====")
  for ($i = $end; $i -ge [Math]::Max(1, $end - 16); $i--) {
    $t = $c[$i-1]
    Write-Output ("{0}: {1}" -f $i, $t) | Out-Null
    Write-Output ("  {0}: {1}" -f $i, $t)
  }
  Write-Output "-----"
}

# Known function starts (1-based):
#   58   getFamousPrayers
#   1921 getQuotes
#   18628 justBecauseArray
#   19118 getFavWords
#   AUTHOR_PHOTOS map around 19062-19116
Show-Close "getFamousPrayers" "famoss" 58
Show-Close "getQuotes" "quotes" 1921
Show-Close "justBecauseArray" "justbecause" 18628
Show-Close "getFavWords" "favword" 19118
# AUTHOR_PHOTOS closing: show 19100-19116
Write-Output "===== AUTHOR_PHOTOS region 19090-19116 ====="
foreach ($i in 19090..19116) { Write-Output ("{0}: {1}" -f $i, $c[$i-1]) }
