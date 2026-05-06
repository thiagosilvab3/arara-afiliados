"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  AdminOrder,
  ContactChannel,
  OrderStatus,
  PaymentPreference,
  PaymentStatus,
} from "../lib/types";
import { updateOrderStatusAction } from "../app/admin/pedidos/actions";
import { formatCurrency } from "../lib/utils";
import styles from "./OrdersDashboard.module.css";

type OrdersDashboardProps = {
  initialOrders: AdminOrder[];
};

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "new",
  "contact_pending",
  "contacted",
  "awaiting_payment_manual",
  "redirected_to_affiliate",
  "converted",
  "cancelled",
  "lost",
];

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Novo",
  contact_pending: "Contato pendente",
  contacted: "Contactado",
  awaiting_payment_manual: "Aguardando pagamento manual",
  redirected_to_affiliate: "Redirecionado ao afiliado",
  converted: "Convertido",
  cancelled: "Cancelado",
  lost: "Perdido",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pendente",
  paid: "Pago",
  failed: "Falhou",
  not_applicable: "Não se aplica",
  refunded: "Reembolsado",
};

const CONTACT_CHANNEL_LABELS: Record<ContactChannel, string> = {
  email: "E-mail",
  whatsapp: "WhatsApp",
  phone: "Telefone",
};

const PAYMENT_PREFERENCE_LABELS: Record<PaymentPreference, string> = {
  pix: "Pix",
  cartao: "Cartão",
  boleto: "Boleto",
  falar_com_atendimento: "Falar com atendimento",
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildStatusMap(orders: AdminOrder[]) {
  return Object.fromEntries(
    orders.map((order) => [order.id, order.orderStatus])
  ) as Record<string, OrderStatus>;
}

export function OrdersDashboard({ initialOrders }: OrdersDashboardProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [statusByOrderId, setStatusByOrderId] = useState<Record<string, OrderStatus>>(
    () => buildStatusMap(initialOrders)
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setStatusByOrderId(buildStatusMap(initialOrders));
  }, [initialOrders]);

  const stats = useMemo(() => {
    const total = initialOrders.length;
    const newOrders = initialOrders.filter((order) => order.orderStatus === "new").length;
    const converted = initialOrders.filter(
      (order) => order.orderStatus === "converted"
    ).length;
    const affiliate = initialOrders.filter(
      (order) => order.productType === "affiliate"
    ).length;

    return {
      total,
      newOrders,
      converted,
      affiliate,
    };
  }, [initialOrders]);

  function updateLocalStatus(orderId: string, orderStatus: OrderStatus) {
    setStatusByOrderId((current) => ({
      ...current,
      [orderId]: orderStatus,
    }));
  }

  function saveOrderStatus(orderId: string) {
    setMessage("");
    setError("");
    setSavingOrderId(orderId);

    startTransition(async () => {
      const nextStatus = statusByOrderId[orderId];

      const result = await updateOrderStatusAction({
        orderId,
        orderStatus: nextStatus,
      });

      if (!result.success) {
        setError(result.message);
        setSavingOrderId(null);
        return;
      }

      setMessage("Status do pedido atualizado com sucesso.");
      setSavingOrderId(null);
      router.refresh();
    });
  }

  return (
    <div className={styles.page}>
      <div className="container">

        <div className={styles.header}>
          <h1>Pedidos</h1>
          <p className="muted">
            Acompanhe os pedidos enviados no checkout e atualize o status do funil.
          </p>
        </div>

        <div className={styles.stats}>
          <div className={`card ${styles.statCard}`}>
            <span>Total</span>
            <strong>{stats.total}</strong>
          </div>

          <div className={`card ${styles.statCard}`}>
            <span>Novos</span>
            <strong>{stats.newOrders}</strong>
          </div>

          <div className={`card ${styles.statCard}`}>
            <span>Convertidos</span>
            <strong>{stats.converted}</strong>
          </div>

          <div className={`card ${styles.statCard}`}>
            <span>Afiliados</span>
            <strong>{stats.affiliate}</strong>
          </div>
        </div>

        {message ? <p className={styles.success}>{message}</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        {initialOrders.length === 0 ? (
          <section className={`panel ${styles.emptyPanel}`}>
            <p className="muted">Nenhum pedido encontrado ainda.</p>
          </section>
        ) : (
          <div className={styles.orderList}>
            {initialOrders.map((order) => {
              const currentStatus =
                statusByOrderId[order.id] ?? order.orderStatus;

              return (
                <article key={order.id} className={`panel ${styles.orderCard}`}>
                  <div className={styles.orderHeader}>
                    <div>
                      <h2>{order.productTitleSnapshot}</h2>
                      <p className="muted">
                        Pedido em {formatDateTime(order.createdAt)}
                      </p>
                    </div>

                    <div className={styles.badges}>
                      <span className={styles.badge}>
                        {order.productType === "affiliate" ? "Afiliado" : "Próprio"}
                      </span>

                      <span className={styles.badge}>
                        {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Cliente</span>
                      <strong>{order.customerName}</strong>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.label}>E-mail</span>
                      <strong>{order.customerEmail}</strong>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.label}>Telefone</span>
                      <strong>{order.customerPhone || "—"}</strong>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.label}>Preço</span>
                      <strong>{formatCurrency(order.productPriceSnapshot)}</strong>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.label}>Checkout</span>
                      <strong>{order.checkoutType}</strong>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.label}>Origem</span>
                      <strong>{order.source}</strong>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.label}>Contato preferido</span>
                      <strong>
                        {order.preferredContactChannel
                          ? CONTACT_CHANNEL_LABELS[order.preferredContactChannel]
                          : "—"}
                      </strong>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.label}>Preferência de pagamento</span>
                      <strong>
                        {order.paymentPreference
                          ? PAYMENT_PREFERENCE_LABELS[order.paymentPreference]
                          : "—"}
                      </strong>
                    </div>
                  </div>

                  {order.notes ? (
                    <div className={styles.notesBox}>
                      <span className={styles.label}>Observações</span>
                      <p>{order.notes}</p>
                    </div>
                  ) : null}

                  <div className={styles.actionsRow}>
                    <label className={styles.statusField}>
                      <span className={styles.label}>Status do pedido</span>
                      <select
                        className="field"
                        value={currentStatus}
                        onChange={(e) =>
                          updateLocalStatus(order.id, e.target.value as OrderStatus)
                        }
                        disabled={isPending}
                      >
                        {ORDER_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {ORDER_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      type="button"
                      className="btn btnPrimary"
                      onClick={() => saveOrderStatus(order.id)}
                      disabled={isPending}
                    >
                      {isPending && savingOrderId === order.id
                        ? "Salvando..."
                        : "Salvar status"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}