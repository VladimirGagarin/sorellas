$f = "C:\Emily_Backup\Desktop\cottolengo-suors\src\components\Utils.js"
$c = Get-Content $f
$total = $c.Count
Write-Output ("TOTAL LINES: " + $total)

function Find-FnEnd([int]$startLine) {
  # returns line number of the closing "}" of the function that starts at startLine
  $depth = 0
  for ($i = $startLine; $i -le $c.Count; $i++) {
    $t = $c[$i - 1]
    foreach ($ch in $t.ToCharArray()) {
      if ($ch -eq '{') { $depth++ }
      elseif ($ch -eq '}') {
        $depth--
        if ($depth -eq 0) { return $i }
      }
    }
  }
  return -1
}

function Find-ArrayClose([int]$fnEndLine) {
  # going backwards from the function end, find the first line that is exactly "];" or endswith "];"
  for ($i = $fnEndLine - 1; $i -ge 1; $i--) {
    $t = $c[$i - 1].Trim()
    if ($t -match '^\]\s*;?\s*$') { return $i }
  }
  return -1
}

# For each target function, compute fn end + array close
foreach ($pair in @(
    @("getFamousPrayers", 58),
    @("getQuotes", 1921),
    @("justBecauseArray", 18628),
    @("getFavWords", 19118)
)) {
  $name = $pair[0]; $start = $pair[1]
  $fnEnd = Find-FnEnd $start
  $arrClose = Find-ArrayClose $fnEnd
  Write-Output ("{0}: start={1} fnEnd={2} arrayClose={3}" -f $name, $start, $fnEnd, $arrClose)
  if ($arrClose -gt 0) {
    Write-Output ("  ----- lines {0}-{1}:" -f ($arrClose - 8), $arrClose)
    foreach ($n in (($arrClose - 8)..$arrClose)) { Write-Output ("    {0}: {1}" -f $n, $c[$n - 1]) }
  }
}

# AUTHOR_PHOTOS map: find its bounds
$apStart = 0
for ($i = 19050; $i -lt $c.Count; $i++) {
  if ($c[$i - 1] -match 'AUTHOR_PHOTOS') { $apStart = $i; break }
}
Write-Output ("AUTHOR_PHOTOS first matching line: " + $apStart)
# print content of AUTHOR_PHOTOS map object: from apStart find "=" and "{" then closing
