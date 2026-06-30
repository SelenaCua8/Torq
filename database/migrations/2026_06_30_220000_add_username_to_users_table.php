<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('name');
            $table->string('email')->nullable()->change();
        });

        $users = \DB::table('users')->whereNull('username')->get();
        foreach ($users as $user) {
            $base = $user->email ? strstr($user->email, '@', true) : 'user' . $user->id;
            $username = $base;
            $i = 1;
            while (\DB::table('users')->where('username', $username)->where('id', '!=', $user->id)->exists()) {
                $username = $base . $i;
                $i++;
            }
            \DB::table('users')->where('id', $user->id)->update(['username' => $username]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('username');
            $table->string('email')->nullable(false)->change();
        });
    }
};