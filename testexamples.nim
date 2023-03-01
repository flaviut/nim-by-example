import md5, re, os, strutils, osproc

let
  markdownFilesGlob = getCurrentDir() / "content" / "content"
  configFilePath = getCurrentDir() / "validcodehashes.txt"

for filePath in walkDirRec(markdownFilesGlob):
  if filePath.splitFile.ext != ".md":
    continue

  let file = open(filePath, fmRead)
  let fileContents = file.readAll()
  file.close()

  let sourceSegments = fileContents.findAll(re"""\n(?i)```\s*nim[\s\S]*?```""")
  
  for match in sourceSegments:
    echo filePath

    let code = match.replacef(re"""\n(?i)```\s*nim[ \t]*\s([\s\S]*?)```""", "$1")
    let codeHash = code.getMD5()
    if not configFilePath.readFile().contains(codeHash):  # Hasn't been verified yet
      let tempCodePath = getTempDir() / "code.nim"
      tempCodePath.writeFile(code)
      let (output, exitCode) = execCmdEx("nim c -r --verbosity:0 " & tempCodePath)

      var printableCode = ""
      for line in code.splitLines():
        printableCode.add("    " & line & "\n")
      
      var printableOutput = ""
      if output != nil:
        for line in output.splitLines():
          printableOutput.add("> " & line & "\n")

      stdout.write(printableCode & printableOutput)

      stdout.write("Everything ok? (y/n) ")
      case stdin.readLine.toLower:
        of "y":
          configFilePath.writeFile(configFilePath.readFile() & "\n" & codeHash)
        of "n":
          discard

      echo "===================="
