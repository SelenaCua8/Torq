<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ServiceCompleted extends Mailable
{
    use Queueable, SerializesModels;

    // 1. Declaramos las variables que van a viajar al correo
    public $machine;
    public $mechanicName;

    /**
     * Create a new message instance.
     */
    public function __construct($machine, $mechanicName)
    {
        // 2. Las recibimos desde el controlador y las guardamos
        $this->machine = $machine;
        $this->mechanicName = $mechanicName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        // 3. Acá ponemos el asunto del correo que te va a llegar
        return new Envelope(
            subject: '🔧 Nuevo Service Completado - Torq',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // 4. Acá le indicamos dónde está el diseño HTML que armamos antes
        return new Content(
            view: 'emails.service_completed',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}