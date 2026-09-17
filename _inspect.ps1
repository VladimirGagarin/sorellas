$f = "C:\Emily_Backup\Desktop\cottolengo-suors\src\components\Utils.js"
$c = Get-Content $f
$n = $c.Count
Write-Output ("TOTAL: " + $n)

function Get-FnEnd([int]$startLine) {
  $depth = 0
  for ($i = $startLine; $i -le $n; $i++) {
    foreach ($ch in $c[$i - 1].ToCharArray()) {
      if ($ch -eq '{') { $depth++ }
      elseif ($ch -eq '}') {
        $depth--
        if ($depth -eq 0) { return $i }
      }
    }
  }
  return -1
}

function Show-Tail([string]$name, [int]$startLine) {
  $end = Get-FnEnd $startLine
  Write-Output "=============================="
  Write-Output ("{0}: fnStart={1} fnEnd={2}" -f $name, $startLine, $end)
  $s = [Math]::Max(1, $end - 14)
  for ($i = $s; $i -le $end; $i++) {
    Write-Output ("  {0}: {1}" -f $i, $c[$i - 1])
  }
}

Show-Tail "getFamousPrayers" 58
Show-Tail "getQuotes" 1921
Show-Tail "justBecauseArray" 18628
Show-Tail "getFavWords" 19118

Write-Output "=============================="
Write-Output "AUTHOR_PHOTOS: locate start and its close"
$apStart = -1
for ($i = 1; $i -le $n; $i++) {
  if ($c[$i - 1] -match 'AUTHOR_PHOTOS\s*=') { $apStart = $i; break }
}
Write-Output ("AUTHOR_PHOTOS line: " + $apStart)
if ($apStart -gt 0) {
  $depth = 0
  for ($i = $apStart; $i -le $n; $i++) {
    $m = 0; $mm = 0
    (([regex]::Matches($c[$i - 1], '\{')).Count) | ForEach-Object { $m += $_ }
    ($c[$i - 1].ToCharArray() | Where-Object { $_ -eq '{' }).Count | ForEach-Object { $mm = $_ }
    $ob = ($c[$i - 1].ToCharArray() | Where-Object { $_ -eq '{' }).Count
    $cb = ($c[$i - 1].ToCharArray() | Where-Object { $_ -eq '}' }).Count
    $depth = $depth + $ob - $cb
    if ($depth -eq 0 -and $i -gt $apStart) {
      Write-Output ("AUTHOR_PHOTOS closes at: " + $i)
      for ($j = $i - 3; $j -le $i; $j++) { Write-Output ("  {0}: {1}" -f $j, $c[$j - 1]) }
      break
    }
  }
}
