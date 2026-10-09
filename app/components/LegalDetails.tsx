import { cn } from '~/lib/utils';

/** Seller details, payment and cookie notices: the footer and /documents. Same text as the customer app. */
export function LegalDetails({ className }: { className?: string }) {
  return (
    <div className={cn('grid gap-5 text-xs text-muted-foreground', className)}>
      <p className="font-mono leading-relaxed">
        ИП Айгиз Искужин · ИНН 024803896842 · ОГРНИП 326028000044859
        <br />
        ОКВЭД 62.01 Разработка компьютерного программного обеспечения · Оператор ПД в реестре РКН №{' '}
        <a className="underline hover:text-foreground" href="https://pd.rkn.gov.ru/operators-registry/operators-list/?id=2-26-056967" target="_blank" rel="noreferrer">
          2-26-056967
        </a>
      </p>
      <div className="flex max-w-3xl items-start gap-3">
        <TBankMark />
        <p className="leading-relaxed">
          Приём платежей осуществляется АО «ТБанк» (лицензия Банка России № 2673). Платёжные данные передаются по защищённому каналу и не хранятся на наших
          серверах.
        </p>
      </div>
      <p className="max-w-3xl leading-relaxed">
        Продолжая использовать наш сайт, вы даёте согласие на обработку файлов cookies и других пользовательских данных в соответствии с{' '}
        <a className="underline hover:text-foreground" href="https://docs.sportgearhub.ru/privacy" target="_blank" rel="noreferrer">
          Политикой конфиденциальности
        </a>
        .
      </p>
    </div>
  );
}

function TBankMark() {
  return (
    <svg width="28" height="31" viewBox="0 0 29 32" fill="none" aria-hidden className="mt-0.5 shrink-0">
      <path d="M0 4H29V17.5849C29 21.3238 27.0054 24.7789 23.7676 26.6485L14.5001 32L5.23246 26.6485C1.99457 24.7789 3.32377e-06 21.3238 3.32377e-06 17.5849L0 4Z" fill="#FFDD2D" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 11V15.5077C8.6164 14.8116 9.73715 14.3406 11.0186 14.3406H12.4111V19.5807C12.4111 20.9748 12.0323 22.3399 11.4703 23.0111H17.5276C16.9668 22.3392 16.5889 20.9758 16.5889 19.5834V14.3406H17.9815C19.2629 14.3406 20.3836 14.8116 21 15.5077V11H8Z"
        fill="#333333"
      />
    </svg>
  );
}
