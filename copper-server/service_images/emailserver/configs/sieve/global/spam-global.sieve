require ["fileinto","mailbox"];

if anyof(
    header :contains ["X-Spam-Flag"] "YES",
    header :contains ["X-Spam"] "Yes",
    header :contains ["Subject"] "*** SPAM ***"
    )
{
    fileinto :create "Spam";
    stop;
}