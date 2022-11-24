const {newFileCopyrightString, newFileCopyrightRegexpString} = require('./oracle-copyright-text');

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    messages: {
      missingCopyrightMessage: 'Missing Oracle copyright for source file',
      copyrightNeedsFix: 'copyright for the file does not match oracle template \n{{newFileCopyrightString}}'
    }
  },
  create: context => {
    const sourceCode = context.getSourceCode().getText();
    const [firstComment, secondComment] = context.getSourceCode().getAllComments();
    let srcSnippet = sourceCode.replace(/\r/g, '').substring(0, String(newFileCopyrightString).length);

    // console.log('firstComment', firstComment);

    return {
      Program(node) {
        let firstNode;
        let hasComment = false;
        let hasShebang = false;
        if (!firstComment) {
          firstNode = node; // direct code, no copyright
        } else if (firstComment.loc.start.line <= node.loc.start.line) {
          hasComment = true;
          firstNode = firstComment; // first node is comment comment, check if this is shebang?
          if (firstComment.type === 'Shebang') {
            hasShebang = true;
            firstNode = firstComment;
            firstNode = secondComment ? secondComment : firstComment;
            srcSnippet = sourceCode
              .replace(/\r/g, '')
              .substring(firstComment.end + 2, firstComment.end + 2 + String(newFileCopyrightString).length);
          }
        } else {
          firstNode = node;
        }

        let copyrightMatches = false;

        if (srcSnippet && newFileCopyrightString) {
          copyrightMatches = newFileCopyrightString.replace(/\r/g, '').trim() === srcSnippet.replace(/\r/g, '').trim();
          //If the copyright matches, return early
          if (copyrightMatches) {
            return;
          }
        }

        // 1. comment exists and does not match copyright template, could be a outdated copyright/file/class description
        if (hasComment && !copyrightMatches) {
          // firstNode variable is pointing to firstComment node in source file
          const commentStr = `/*${firstNode.value.replace(/\r/g, '')}*/`;
          if (!commentStr.trim().match(newFileCopyrightRegexpString)) {
            // FIXME: potential to have duplicate copyright blocks if user tweaks the punctuation or content manually.
            if (hasShebang) {
              context.report({
                node,
                messageId: 'copyrightNeedsFix',
                data: {
                  filePath: context.getFilename(),
                  newFileCopyrightString
                },
                fix(fixer) {
                  return fixer.insertTextAfter(firstComment, `\n\n${newFileCopyrightString}\n`);
                }
              });

              return;
            }
            context.report({
              node,
              messageId: 'copyrightNeedsFix',
              data: {
                filePath: context.getFilename(),
                newFileCopyrightString
              },
              fix(fixer) {
                return fixer.insertTextBeforeRange([0, 0], `${newFileCopyrightString}\n\n`);
              }
            });

            return;
          }
        }

        // 2. code first line is not comment and in this case template can be easily included and fixed
        if (!hasComment) {
          context.report({
            node,
            messageId: 'missingCopyrightMessage',
            data: {
              filePath: context.getFilename()
            },
            fix(fixer) {
              return fixer.insertTextBeforeRange([0, 0], `${newFileCopyrightString}\n\n`);
            }
          });
        }
      }
    };
  }
};
