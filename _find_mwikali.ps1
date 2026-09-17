$f = "C:\Emily_Backup\Desktop\cottolengo-suors\src\components\Utils.js"
$c = Get-Content $f
$total = $c.Count
Write-Output ("TOTAL lines: " + $total)

Write-Output ""
Write-Output "=== 1) Lines that EQUAL quote-bounded: `author: \"Sr. Mary Mwikali\"` (short, no Matheka) ==="
for ($i = 1; $i -le $total; $i++) {
  $t = $c[$i - 1].TrimEnd()
  if ($t -eq 'author: "Sr. Mary Mwikali",') {
    Write-Output ("{0}: {1}" -f $i, $t)
  }
}

Write-Output ""
Write-Output "=== 2) Lines containing the short literal `Sr. Mary Mwikali` NOT followed by ` Matheka` ==="
for ($i = 1; $i -le $total; $i++) {
  $t = $c[$i - 1]
  if ($t -match 'Sr\. Mary Mwikali' -and $t -notmatch 'Sr\. Mary Mwikali Matheka') {
    Write-Output ("{0}: {1}" -f $i, $t)
  }
}

Write-Output ""
Write-Output "=== 3) Lines containing `Sr. Mary Mwikali Matheka` (canonical) -> count ==="
$cnt = 0
for ($i = 1; $i -le $total; $i++) {
  if ($c[$i - 1] -match 'Sr\. Mary Mwikali Matheka') { $cnt++ }
}
Write-Output ("count: " + $cnt)
