#!/bin/bash

rm -r Transactions_cache
mongoexport -h "mongodb_url_here" -d history -c "collection_name_here" -u "username_here" -p "password_here" -o transactions.csv --type=csv -f category,price,date
vim -c ':silent! call Process()' -c ':wq' transactions.csv
Rscript transactions.R
R -e 'rmarkdown::render("Transactions.Rmd")'
