import { useTranslation } from "react-i18next";
import "../translations"

export function useTranslations() {
    const { t } = useTranslation();

    const tra = (stringa: string) =>{
        return(t(stringa))
    }

    return {tra};
}