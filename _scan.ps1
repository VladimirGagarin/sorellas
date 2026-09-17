$f = "C:\Emily_Backup\Desktop\cottolengo-suors\src\components\Utils.js"
$c = Get-Content $f
$n = $c.Count
Write-Output ("TOTAL LINES: " + $n)
Write-Output ""

Write-Output "=== 1) EVERY line mentioning 'Sr. Mary Mwikali' (any variant), with classification ==="
for ($i = 1; $i -le $n; $i++) {
  $t = $c[$i - 1]
  if ($t -match 'Sr\. Mary Mwikali') {
    $kind = "??"
    if ($t -match '"Sr\. Mary Mwikali Matheka"') { $kind = "FULL+Matheka" }
    elseif ($t -match '"Sr\. Mary Mwikali"')      { $kind = "SHORT (no Matheka)" }
    elseif ($t -match 'Sr\. Mary Mwikali M')      { $kind = "has Matheka" }
    Write-Output ("{0} [{1}] {2}" -f $i, $kind, $t)
  }
}
Write-Output ""
Write-Output "=== 2) Count of SHORT literal (quote-bounded, NOT followed by ' Matheka') per line ==="
for ($i = 1; $i -le $n; $i++) {
  $t = $c[$i - 1]
  if ($t -match 'Sr\. Mary Mwikali"') {
    # contains closing quote after 'Mwikali' (i.e., no 'Matheka' in that token)
    if ($t -notmatch 'Sr\. Mary Mwikali Matheka') {
      Write-Output ("{0}: {1}" -f $i, $t)
    }
  }
}
