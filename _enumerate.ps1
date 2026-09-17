$f = "C:\Emily_Backup\Desktop\cottolengo-suors\src\components\Utils.js"
$c = Get-Content $f
$n = $c.Count

Write-Output ("TOTAL: " + $n)
Write-Output ""
Write-Output "=== P1) author: exactly short 'Sr. Mary Mwikali' (no Matheka) ==="
for ($i = 1; $i -le $n; $i++) {
  if ($c[$i - 1] -match '^author:\s*"Sr\. Mary Mwikali",?\s*$') {
    Write-Output ("  {0}: {1}" -f $i, $c[$i - 1])
  }
}

Write-Output ""
Write-Output "=== P2) photo-map key exactly short 'Sr. Mary Mwikali' (no Matheka) ==="
for ($i = 1; $i -le $n; $i++) {
  if ($c[$i - 1] -match '^"Sr\. Mary Mwikali":\s*"\.\./assets/') {
    Write-Output ("  {0}: {1}" -f $i, $c[$i - 1])
  }
}

Write-Output ""
Write-Output "=== P3) count of full 'Sr. Mary Mwikali Matheka' author/photo occurrences ==="
$cnt = 0
for ($i = 1; $i -le $n; $i++) {
  if ($c[$i - 1] -match 'Sr\. Mary Mwikali Matheka') { $cnt++ }
}
Write-Output ("  count: " + $cnt)

Write-Output ""
Write-Output "=== P4) AUTHOR_PHOTOS exact block 19078-19090 ==="
for ($i = 19078; $i -le 19090; $i++) {
  Write-Output ("  {0}: {1}" -f $i, $c[$i - 1])
}
