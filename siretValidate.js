app.directive('siretValidate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue)
            {
                scope.siretDigitsAndValidLength = viewValue && /^[0-9]{14}$/.test(viewValue);
                
                function valid_siret(siret) 
                {
                    var estValide;
                    if ( (siret.length != 14) || (isNaN(siret)) )
                        estValide = false;
                    else
                    {
                        //~ Donc le SIRET est un numérique à 14 chiffres
                        //~ Les 9 premiers chiffres sont ceux du SIREN (ou RCS), les 4 suivants
                        //~ correspondent au numéro d'établissement
                        //~ et enfin le dernier chiffre est une clef de LUHN. 
                        var somme = 0;
                        var tmp;
                        for (var cpt = 0; cpt<siret.length; cpt++)
                        {
                            if ((cpt % 2) == 0)
                            { //~ Les positions impaires : 1er, 3è, 5è, etc... 
                                tmp = siret.charAt(cpt) * 2; //~ On le multiplie par 2
                                if (tmp > 9) 
                                    tmp -= 9;  //~ Si le résultat est supérieur à 9, on lui soustrait 9
                            }
                            else
                                tmp = siret.charAt(cpt);
                            
                            somme += parseInt(tmp);
                        }
                        
                        if ((somme % 10) == 0)
                            estValide = true; //~ Si la somme est un multiple de 10 alors le SIRET est valide 
                        else
                            estValide = false;
                    }
                    return estValide;
                }
                scope.siretConformity = valid_siret(viewValue);

                if(scope.siretDigitsAndValidLength && scope.siretConformity) {
                    ctrl.$setValidity('siret', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('siret', false);                    
                    return undefined;
                }

            });
        }
    };
});
