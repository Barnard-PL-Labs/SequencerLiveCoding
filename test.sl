(set-logic SLIA)

(synth-fun f ((z String)(z1 String)) String
    ((Start String) (ntString String) (ntInt Int))
    ((Start String (ntString))
    (ntString String (z z1 (str.++ ntString ntString)(str.substr ntString ntInt ntInt)))
    (ntInt Int (0 (+ ntInt ntInt) (str.indexof ntString ntString ntInt)))))

(constraint (= (f "driinki" "n") "driindriindriindriin"))
(constraint (= (f "singsong" "g") "singsingsing"))
(constraint (= (f "greatapplez" "p") "greatapgreatapgreatapgreatapgreatapgreatap"))
(constraint (= (f "grow" "w") "growgrowgrow"))
(check-synth)
