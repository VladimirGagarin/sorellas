$f = "C:\Emily_Backup\Desktop\cottolengo-suors\src\components\Utils.js"
$c = Get-Content $f
$n = $c.Count

Write-Output "=== A) all 'export function' lines ==="
for ($i = 1; $i -le $n; $i++) {
  if ($c[$i - 1] -match '^\s*export\s+function\s+[A-Za-z0-9_]+') {
    Write-Output ("{0}: {1}" -f $i, (($c[$i - 1]).Trim()))
  }
}

Write-Output ""
Write-Output "=== B) all 'export const' lines (top-level maps/lists) ==="
for ($i = 1; $i -le $n; $i++) {
  if ($c[$i - 1] -match '^\s*export\s+const\s+[A-Za-z0-9_]+\s*=') {
    Write-Output ("{0}: {1}" -f $i, (($c[$i - 1]).Trim()))
  }
}

Write-Output ""
Write-Output "=== C) tail of getFamousPrayers (lines 1500-1521) ==="
for ($i = 1500; $i -le [Math]::Min(1521, $n); $i++) { Write-Output ("{0}: {1}" -f $i, $c[$i - 1]) }

Write-Output ""
Write-Output "=== D) tail of getQuotes (lines 12735-12754) ==="
for ($i = 12735; $i -le [Math]::Min(12754, $n); $i++) { Write-Output ("{0}: {1}" -f $i, $c[$i - 1]) }
